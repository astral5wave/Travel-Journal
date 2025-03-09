import axiosInstance from "./axiosInstance";

const uploadImage= async (imageFile)=>{
    const formData=new FormData();
    // used to create Body, specifically Form Data which Have key value Pairs and used to send multipart form data like images,vids etc etc
    formData.append("image",imageFile);
    try{
        const imageUploadResponse=await axiosInstance.post("/image-upload",formData,{
            headers:{
                "Content-Type":"multipart/form-data",
            },
        })
        return imageUploadResponse.data;
    }catch(error){
        console.log("Error Uploading the Image");
        throw error;  // this is so our AddTravelStory Function could catch this error
    }
}

export default uploadImage;