import NoDataAnimation from "./NoDataAnimation.json"
import NoFilterAnimation from "./NoFilterAnimation.json"
import NoSearchAnimation from "./NoSearchAnimation.json"

export const validateEmail=(email)=>{
    const regexEmail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;;
    return regexEmail.test(email);
};

export const getInitials=(name)=>{
    if(!name) return "";

    const initialArray=name.split(" ");
    if(initialArray.length==1){
        return initialArray[0][0].toUpperCase();
    }
    const initial=initialArray[0][0]+initialArray[initialArray.length-1][0];
    return initial.toUpperCase();
};

export const getEmptyCardMessage=(filterType)=>{
    switch (filterType) {
        case "search":
            return "Opps! No stories found matching your search";
        case "date":
            return "No stories found in the given date range";
        default:
            return "Oops! Your travel journal is empty! Explore, create memories, and fill this space with your adventures!";
    }
}

export const getEmptyCardImage=(filterType)=>{
    switch (filterType) {
        case "search":
            return NoSearchAnimation;
        case "date":
            return NoFilterAnimation;
        default:
            return NoDataAnimation;
    }
}