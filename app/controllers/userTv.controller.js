import db from "../models/index.js";
import responseErrors from "../middlewares/errorHandler.js";
const User = db.user;
const TV = db.tv;

export const getAllTvByUser = async (req, res) => {
  try {
    const selectedUserId = req.params.userId;
    const selectedUser = await User.findById(selectedUserId)
      .populate("tv")
      .exec();
    if (!selectedUser) {
      await responseErrors.responseUsersErrors(404, res);
    }
    const selectedTv = selectedUser.tv;
    return res.status(200).json(selectedTv);
  } catch (err) {
    await responseErrors.responseTvErrors(500, res);
  }
};

export const addTVToUser = async (req, res) => {
  try {
    const selectedUserId = req.params.userId;
    const selectedUser = await User.findById(selectedUserId);

    const tvId = req.params.tvId;
    const selectedTv = await TV.findById(tvId);

    if (!selectedUser || !selectedTv) {
      if (!selectedUser) {
        await responseErrors.responseUsersErrors(404, res);
      } else {
        await responseErrors.responseTvErrors(404, res);
      }
    } else {
      // Check if the TV show is already in the user's TV array
      if (selectedUser.tv.includes(selectedTv._id)) {
        await responseErrors.responseTvErrors(400, res);
      } else {
        // Add the TV show ID to the user's TV array
        selectedUser.tv.push(selectedTv._id);

        // Save the updated user document
        await selectedUser.save();
        return res
          .status(200)
          .json({ message: "La série TV a été ajoutée avec succès!" });
      }
    }
  } catch (err) {
    await responseErrors.responseTvErrors(500, res);
  }
};

export const deleteTvTuser = async (req, res) => {
  try {
    const selectedUserId = req.params.userId;
    const selectedUser = await User.findById(selectedUserId);
    const tvId = req.params.tvId;

    if (!selectedUser || !tvId) {
      if (!selectedUser) {
        await responseErrors.responseUsersErrors(404, res);
      } else {
        await responseErrors.responseTvErrors(404, res);
      }
    }

    // Find the index of the TV show in the user's TV array
    const tvIndex = selectedUser.tv.findIndex((tv) => tv.equals(tvId));

    // Check if the TV show is associated with the user
    if (tvIndex === -1) {
      await responseErrors.responseUsersErrors(404, res);
    }

    // Remove the TV show from the user's TV array
    selectedUser.tv.splice(tvIndex, 1);

    // Save the updated user document
    await selectedUser.save();

    return res.status(200).json({ message: "Série TV supprimé avec succes !" });
  } catch (err) {
    await responseErrors.responseTvErrors(500, res);
  }
};
