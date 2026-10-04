import Notification from "../models/notification.model.js";
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ recipient: userId })
    
      .sort({ createdAt: -1 })
    
      .populate("sender", "name username profileImg")
    
      .populate("post", "text image");

    return res.status(200).json(notifications);
  } catch (error) {
    
    console.error("Error in getNotifications controller:", error.message);
   
    return res.status(500).json({
      message: "خطأ في السيرفر أثناء جلب الإشعارات",
      error: error.message,
    });
  }
};

export const markNotificationsAsRead = async (req, res) => {
  try {
  
    const userId = req.user._id;

    await Notification.updateMany(
      { recipient: userId, read: false },
      { $set: { read: true } }, 
    );

    return res
      .status(200)
      .json({ message: "تم تحديث كافة الإشعارات إلى مقروءة بنجاح" });
  } catch (error) {
    console.error(
      "Error in markNotificationsAsRead controller:",
      error.message,
    );
    return res.status(500).json({
      message: "خطأ في السيرفر أثناء تحديث حالة الإشعارات",
      error: error.message,
    });
  }
};


export const deleteNotification = async (req, res) => {
  try {
   
    const { id: notificationId } = req.params;
  
    const userId = req.user._id;

   
    const notification = await Notification.findById(notificationId);

   
    if (!notification) {
      return res.status(404).json({ message: "No notification " });
    }

    if (notification.recipient.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "not allow to delete this notification " });
    }

    await Notification.findByIdAndDelete(notificationId);

    return res.status(200).json({ message: "notification has delete succesfully" });
  } catch (error) {
    console.error("Error in deleteNotification controller:", error.message);
    return res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
};

export const deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.deleteMany({ recipient: userId });

    return res.status(200).json({ message: "all notification has been deleted" });
  } catch (error) {
    console.error("Error in deleteAllNotifications controller:", error.message);
    return res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
};
