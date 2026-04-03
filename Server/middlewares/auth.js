import { getAuth } from "@clerk/express";

export const protect= async(req,res,next)=>{
    try {
        const auth = getAuth(req);
         const  userId  = req.userId;
         console.log(req.headers);
         console.log("AUTH DATA:", auth); 
        if(!userId){
            return res.json({success:false,message:"not authenticated"})
        }
        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}