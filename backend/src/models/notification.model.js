import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
  
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    type: {
      type: String,
      required: true,
      enum: ["like", "comment", "follow"], 
    },
  
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
    // 5. حالة الإشعار (هل قرأه المستخدم أم لا)
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

notificationSchema.index({ recipient: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;









