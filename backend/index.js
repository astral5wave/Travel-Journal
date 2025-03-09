require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const errorHandler = require("./errorHandler");


const User = require("./models/user.model");
const TravelStory = require("./models/travelStory.model");


const { authenticateToken } = require("./utilities");
const upload = require("./multer");
const { errorMonitor } = require("events");

const PORT=process.env.PORT || 8000;
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB Connected Successfully");
    } catch (e) {
        console.log("Error connecting DB");
    }
}
connect();

const app = express();

app.use(express.json());  // json parsor middleWare

const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],  // Include POST for image uploads
    allowedHeaders: [
        "Content-Type",
        "Authorization",  // For JWT tokens or Auth
        "X-Requested-With"  // Often required for file uploads
    ],
    credentials: true,
    optionsSuccessStatus: 200  // Prevents some browsers from blocking OPTIONS requests
};

app.use(cors(corsOptions));

// Preflight request handling
app.options("*", cors(corsOptions));



app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }
    const isUser = await User.findOne({ email });
    if (isUser) {
        return res.status(400).json({ error: true, message: "User Already exists, Please LogIn" });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const user = new User({
        fullName,
        email,
        password: hashpassword,
    });  // user data is made (like data row is made not inserted)

    await user.save(); //user data is svaed in the DB

    const accessToken = await jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' }); //userID is signed , when unsigned we have acess to userID

    return res.status(201).json({
        error: false,
        user: { fullName: user.fullName, email: user.email },
        accessToken,
        message: "Registration Successfull"
    });
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            error: true,
            message: "Enter all credentials"
        });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            error: true,
            message: "User doesn't exists , Please Register"
        });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({
            error: true,
            message: "Password is not valid"
        });
    }
    const accessToken = await jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "24h" });
    // all valid
    return res.json({
        error: false,
        message: "Login Successfully",
        user: { fullName: user.fullName, email: user.email },
        accessToken
    });
});

app.get("/get-user", authenticateToken, async (req, res) => {
    const { userId } = req.user;
    const isUser = await User.findOne({ _id: userId });

    //token valid OK but is User present or not in DB (deleted User or currently is DB)

    if (!isUser) {
        return res.status(401).json({ error: true, message: "User not found, kindly register" }); // user is not there in databse redirect to LOGIN
    }
    return res.json({
        error: false,
        user: isUser,
    });
});

app.post("/add-travel-story", authenticateToken, async (req, res) => {
    const { title, story, visitedLocation, visitedDate, imageUrl } = req.body;
    const { userId } = req.user;
    //validate fields

    if (!title || !story || !visitedLocation || !visitedDate || !imageUrl) {
        return res.status(400).json({ error: true, message: "All fields required" });
    }

    const parsedVisitedDate = new Date(parseInt(visitedDate));  //millised into Date

    try {
        const travelStory = new TravelStory({
            title,
            story,
            visitedDate: parsedVisitedDate,
            visitedLocation,
            imageUrl,
            userId,
        });

        await travelStory.save();

        return res.status(201).json({ error: false, story: travelStory, message: "Added successfully" });
    } catch (e) {
        return res.status(400).json({ error: true, message: "Error in adding Story" });
    }

});

app.get("/get-travel-stories", authenticateToken, async (req, res) => {
    const { userId } = req.user;
    try {
        const travelStories = await TravelStory.find({ userId: userId }).sort({ isFavourite: -1 }); //array of all stories from one account
        return res.status(200).json({ stories: travelStories });
    } catch (e) {
        return res.status(400).json({ error: true, message: "Error in retreiving stories" });
    }
});

app.put("/edit-travel-story/:id", authenticateToken, async (req, res) => {

    const { id } = req.params;
    const { title, visitedDate, visitedLocation, imageUrl, story } = req.body;
    const { userId } = req.user;

    if (!title || !story || !visitedLocation || !visitedDate) {
        return res.status(400).json({ error: true, message: "All fields required" });
    }

    const parsedVisitedDate = new Date(parseInt(visitedDate));  //millised into Date

    //now chek stroy if it exists
    try {
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId }); // ensures that correct user is updating their story(not someone else's stroy)

        if (!travelStory) {
            return res.status(404).json({ error: true, message: "Travel Story not Found" })
        }

        //story found , now edit it.
        const placeholderImage = "http://localhost:8000/assets/placeholder.png";

        travelStory.title = title;
        travelStory.story = story;
        travelStory.visitedLocation = visitedLocation;
        travelStory.visitedDate = visitedDate;
        travelStory.imageUrl = imageUrl || placeholderImage;  //if imageUrl in not valid then a placeholder url will be shown

        await travelStory.save();
        return res.status(200).json({ story: travelStory, message: "Story Updated Successfully" });
    } catch (e) {
        return res.status(500).json({ error: true, message: `Error during story update: ${e.message}` });
    }

});

app.delete("/delete-travel-story/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    try {
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId }); // ensures that correct user is Deleting their story(not someone else's stroy)

        if (!travelStory) {
            return res.status(404).json({ error: true, message: "Travel Story not Found" })
        }

        await travelStory.deleteOne();  // It will delete this particular document using its id form DB

        //now delete the image related to the story
        const imageUrl = travelStory.imageUrl;
        const filePath = path.join(__dirname, "uploads", path.basename(imageUrl));
        fs.unlink(filePath, (error) => {
            if (error) {
                console.log(`Failed to delete the image : ${path.basename(imageUrl)}`);
                //make a script to maually delete it after some time
            }
        });
        
        return res.status(200).json({ error: false, message: "Story deleted Successfully" });

    } catch (e) {
        return res.status(500).json({ error: true, message: `Error during story deletion: ${e.message}` });
    }

});

app.get("/search", authenticateToken, async (req, res) => {
    const { query } = req.query;
    const { userId } = req.user;

    if (!query) {
        return res.status(400).json({
            error: true,
            message: "No query founds"
        });
    }

    try {
        const searchResult = await TravelStory.find({
            userId: userId,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { story: { $regex: query, $options: "i" } },
                { visitedLocation: { $regex: query, $options: "i" } }
            ]
        }).sort({ isFavourite: -1 });
        // will return all story where user is there along with any of the three codition matches , then sorted based on favourite or non favourite

        return res.status(200).json({
            stories: searchResult
        });
    } catch (e) {
        return res.status(500).json({ error: true, message: `Error during fetching stories: ${e.message}` });
    }

});

app.put("/update-is-favourite/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    const { isFavourite } = req.body;
    try {
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

        if (!travelStory) {
            return res.status(400).json({ error: true, message: "Travel Story not found" });
        }

        travelStory.isFavourite = isFavourite;
        await travelStory.save();
        return res.status(200).json({ story: travelStory, message: "Story Updated Successfully" });
    } catch (e) {
        return res.status(500).json({ error: true, message: `Error during Story update: ${e.message}` });
    }
});

//filter based on date
app.get("/travel-story/filter", authenticateToken, async (req, res) => {
    const { startDate, endDate } = req.query;
    const { userId } = req.user;

    if (!startDate || !endDate) {
        return res.status(400).json({ error: true, message: "No Filter Range found" });
    }

    try {
        const start = new Date(parseInt(startDate));
        const end = new Date(parseInt(endDate));

        const filteredResult = await TravelStory.find({
            userId: userId,
            visitedDate: { $gte: start, $lte: end }
        }).sort({ isFavourite: -1 });

        return res.status(200).json({ stories: filteredResult });
    } catch (e) {
        return res.status(500).json({ error: true, message: `Error during fetching stories: ${e.message}` });
    }
});

//route to handel image upload
app.post("/image-upload", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {  //if file not valid then false is returned and file is not uploaded hence no req.file attribute
            return res.status(400).json({
                error: true,
                message: "No Image Uploaded"
            });
        }
        //till here file is uploaded now we extract its url
        const baseUrl=process.env.BASE_URL || `http://localhost:${PORT}`;
        const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
        return res.status(201).json({ imageUrl });
    }
    catch (e) {
        return res.status(500).json({ error: true, message: e.message }); //error in server side upload
    }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));  // static() is middleware and only works when the url have /uploads
// this means when a req is made from this url insted or response in json , response will be a satic file from the path specified inside it.
//file name will be extracted from the url itself

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.delete("/delete-image", async (req, res) => {
    const { imageUrl } = req.query;  // from query object imageURL property is extracted.

    if (!imageUrl) {
        return res.status(400).json({ error: true, message: "Image URL is required" });
    };

    try {
        const imgPath = path.join(__dirname, "uploads", path.basename(imageUrl));  //this might be the location of the file

        if (fs.existsSync(imgPath)) {   // it will check wether a path exists or not 
            fs.unlinkSync(imgPath);   //it will delete the file at that location ( not used to delete directory)
            return res.status(200).json({ error: false, message: "File deleted successfully" });
        }
        else {
            return res.status(200).json({ error: false, message: "Image not found" });  //again success as no image to delete
        }
    }
    catch (e) {
        return res.status(500).json({ error: true, message: "Server error during Image deletion" });
    }
});

app.delete("/delete-account",authenticateToken, async(req,res)=>{
    try {
        const {userId}=req.user;
        const isUser = await User.findOne({ _id: userId });
        if (!isUser) {
            return res.status(401).json({ error: true, message: "User not found"}); // user is not there in databse redirect to LOGIN
        };
        const travelStories = await TravelStory.find({ userId: userId });
        for (let i = 0; i < travelStories.length; i++) {
            const imageUrl=travelStories[i].imageUrl;
            const imgPath = path.join(__dirname, "uploads", path.basename(imageUrl));
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }
        await TravelStory.deleteMany({ userId: userId });
        await User.deleteOne({ _id: userId });
        res.status(200).json({ error: false, message: "Account and all related data deleted successfully." });
    } catch (e) {
        return res.status(400).json({ error: true, message: "Error while deleting the account" });
    }
});


app.get("/", (req, res) => {
    return res.status(200).json({ error: false, message: "Welcome to server buddy" });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log("Server running in pot : 8000");
});
module.exports = app;