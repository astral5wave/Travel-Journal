const cron = require("node-cron");
const bcrypt = require("bcrypt");
const path = require("path");
const User = require("./models/user.model");
const TravelStory = require("./models/travelStory.model");
const { uploadToCloudinary, cloudinary } = require("./multer");

const demoStories = require("./demoStories.json");

// List of test accounts
const DEMO_EMAILS = [
    "test1@demo.com",
    "test2@demo.com"
];

// Delete a specific test account
const deleteTestAccount = async (email) => {
    const testUser = await User.findOne({ email });

    if (testUser) {
        const travelStories = await TravelStory.find({ userId: testUser._id });

        // Parallel deletion of images from Cloudinary
        const deleteImagePromises = travelStories
            .filter(story => story.image_public_id) // Only filter stories with images
            .map(story => cloudinary.uploader.destroy(story.image_public_id));

        await Promise.all(deleteImagePromises);

        // Parallel deletion of travel stories and user data
        await Promise.all([
            TravelStory.deleteMany({ userId: testUser._id }),
            User.deleteOne({ _id: testUser._id })
        ]);
    }
};


// Create a specific test account
const createTestAccount = async (email) => {
    const hashedPassword = await bcrypt.hash("12345678", 10);

    const newUser = new User({
        fullName: "Demo User",
        email,
        password: hashedPassword,
    });

    await newUser.save();
    return newUser._id;
};

// Add 10 sample travel stories
const addDemoTravelStories = async (userId) => {
    const uploadPromises = demoStories.map(async (story) => {
        const imagePath = path.join(__dirname, "demoImages", story.imageName);
        const result = await uploadToCloudinary(imagePath);

        const travelStory = new TravelStory({
            title: story.title,
            story: story.story,
            visitedDate: story.visitedDate,
            visitedLocation: story.visitedLocation,
            imageUrl: result.secure_url,
            image_public_id: result.public_id,
            userId,
        });

        await travelStory.save();
    });

    await Promise.all(uploadPromises); // Runs uploads in parallel
};


// Main function to reset a specific test account
const resetDemoAccount = async (email) => {
    try {
        await deleteTestAccount(email);
        const userId = await createTestAccount(email);
        await addDemoTravelStories(userId);
        console.log(`Demo account reset for ${email} at ${new Date()}`);
    } catch (error) {
        console.error(`Cron Job Error for ${email}:`, error.message);
    }
};

// Run immediately when the server starts (for the first account)
resetDemoAccount(DEMO_EMAILS[0]);
resetDemoAccount(DEMO_EMAILS[1]);

// Schedule resets
cron.schedule("0 0 * * *", () => resetDemoAccount(DEMO_EMAILS[0])); // Runs daily at 12 AM
cron.schedule("0 0 * * *", () => resetDemoAccount(DEMO_EMAILS[1])); // Runs daily at 12 AM
