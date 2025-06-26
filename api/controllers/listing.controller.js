import Listing from "../models/listing.model.js";
import { errorhandler } from "../utils/error.js";

export const createListing = async(req,res,next)=>{
    try {
        const listing=await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(err);
    }
}

export const deleteListing = async(req,res,next)=>{
    const listing=await Listing.findById(req.params.id);

    if(!listing){
        return next(errorhandler(404,'listing not found'))
    }
    if(req.user.id!==listing.userRef){
        return next(errorhandler(401,'You can only delete your own listing'))
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing has been deleted!')
    } catch (error) {
        next(error)
    }
}