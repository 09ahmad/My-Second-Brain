import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"
import dotenv, { configDotenv } from 'dotenv';
dotenv.config();
import { ContentModel, userModel } from './db';
import { RegisterInput, LoginInput, registerSchema } from './validation';
import {random} from "./utils"
import { UserMiddleware } from './middleware';
import {LinkModel} from './db';

const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;
const app = express();
const router = express.Router();
app.use(cors());
app.use(express.json());
app.use('/api', router);

const config = {
  MONGODB_URL: process.env.MONGODB_URL
}
if (!config.MONGODB_URL) {
  throw new Error("MONGODB_URL environment variable is not defined")
}
mongoose.connect(config.MONGODB_URL)
  .then(() => console.log("MONGODB connected"))
  .catch((error) => console.log("MONGODB connection error ", error))

router.post("/v1/Register", async (req, res) => {
    const validateInput = registerSchema.safeParse(req.body);
    if (!validateInput.success) {
        res.status(400).json({
            error: "Input format error",
            details: validateInput.error.errors
        })
        return;
    }
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.create({
            username: username,
            email: email,
            password: hashedPassword,
        })
        res.status(200).json({
            msg: "Use created Successfully"
        })
    } catch (error) {
        console.error("Error in creating user or User already exits", error),
            res.status(500).json({
                error: "Internal server error "
            })
    }
})


router.post("/v1/login", async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user || !user.password) {
            res.status(404).json({
                error: "User not found "
            })
            return;
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({
                error: "Invalid credentials"
            })
            return;
        }

        if (!SECRET_KEY) {
            throw new Error("SECRET_KEY Exist undefined")
        }

        const token = jwt.sign({ id:user._id}, SECRET_KEY)
        res.status(200).json({
            token,
            message: "Login successfull"
        })

    } catch (error) {
        console.error("Error during login", error)
        res.status(500).json({
            error: "Internal server error"
        })
    }
})

router.post("/v1/content", UserMiddleware, async (req: Request, res: Response) => {
    const { link, type, title } = req.body;
    const userId = req.userId;
    if (!title || !type || !userId) {
        res.status(401).json({
            error: "Missing required fields: title, type, or userId",
        })
    }
    try {
        await ContentModel.create({
            link,
            type,
            title,
            userId,
            tags: [],
        })
        res.status(200).json({
            message: "Content Added successfully"
        })
        return;
    } catch (error) {
        console.error("Error in adding conent:", error);
        res.status(500).json({
            error: "internal server error "
        })
    }
})

router.get("/v1/content",UserMiddleware,async (req:Request,res:Response)=>{

    const userId=req.userId;
    const content=await ContentModel.find({
        userId:userId
    }).populate("userId","username");

    res.json({
        content
    })
})

router.delete("/v1/content",UserMiddleware,async (req:Request,res:Response)=>{
    const contentId=req.body.contentId;
    if(!contentId){
        res.json({
            error:"Id does not exist"
        })
    }
    await ContentModel.deleteMany({
        contentId,
        userId:req.userId
    })
    res.json({
        message:"Deleted"
    })
})
router.post("/v1/brain/share",UserMiddleware, async (req: Request, res: Response) => {
 const share=req.body.share;

  if(share){

  const existingLink = await LinkModel.findOne({
     userId:req.userId 
    })
    if(existingLink){   
    res.json({
     hash:existingLink.hash
     })
      return;
  }
    const hash=random(10);
    await LinkModel.create({
      userId:req.userId,
      hash:hash
    })

     res.json({
       hash
   })
  }else{
    await LinkModel.deleteOne({
     userId:req.userId
    })
  }
  res.json({
    messages:"Remove Link"
  })
})

router.get("/v1/brain/:shareLink", async (req: Request, res: Response) => {
  const hash= req.params.shareLink;
  const link=await LinkModel.findOne({
    hash
  })
  if(!link){
    res.status(401).json({
      message:"Sorry incorrect Input"
    })
    return;
  }

  const content=await ContentModel.find({
    userId:link.userId
  })

  const user=await userModel.findOne({
    _id:link.userId

  })
  if(!user){
    res.status(401).json({
      message:"user not found , error should ideally not happen"
     })
   return;
  }
  res.json({
    username:user.username,
    content:content
  })
   
})

app.listen(PORT, function () {
    console.log(`Server is running on http://localhost:${PORT}`);
});
