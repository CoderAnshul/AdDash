import { User } from "../models/model.login.js";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { Session } from "../models/model.session.js";

const createSafeUserResponse = (userDoc, sessionData = null) => {
    let sessions = 0;
    if (sessionData) {
        sessions = sessionData;
    } else if (userDoc.sessions) {
        sessions = userDoc.sessions.length;
    }

    return {
        _id: userDoc._id,
        userId: userDoc.username,
        alias: userDoc.username,
        contact: {
            email: userDoc.email,
            phone: `${userDoc.cCode || ''} ${userDoc.phoneNumber || ''}`.trim()
        },
        role: userDoc.role,
        status: userDoc.status,
        wallet: 0.00,
        sessions: sessions,
        registered: userDoc.registered,
        lastActive: userDoc.lastActive
    };
};

const getUserById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid user ID" });
    }

    try {
        const user = await User.findById(id)
            .select("-password -token -__v")
            // .populate({
            //     path: 'sessions',
            //     select: 'sessionId type startTime status amount'
            // })
            .lean();

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }

        const userResponse = createSafeUserResponse(user, user.sessions);

        return res.status(httpStatus.OK).json({
            message: "User fetched successfully",
            data: userResponse
        });

    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong: ${error.message}` });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid user ID" });
    }

    const updateData = req.body;

    try {
        if (updateData.password) {
            if (updateData.password.trim() === "") {
                return res.status(httpStatus.BAD_REQUEST).json({ message: "Password cannot be empty" });
            }
            updateData.password = await bcrypt.hash(updateData.password, 10);
        } else {
            delete updateData.password;
        }

        if (updateData.email || updateData.username) {
            const existingUser = await User.findOne({
                $or: [{ email: updateData.email }, { username: updateData.username }],
                _id: { $ne: id }
            });

            if (existingUser) {
                const message = existingUser.email === updateData.email
                    ? "Another user with this email already exists"
                    : "Another user with this username already exists";
                return res.status(httpStatus.CONFLICT).json({ message });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true, context: 'query' }
        ).select("-password -token -__v").lean();

        if (!updatedUser) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found, update failed" });
        }

        const userResponse = createSafeUserResponse(updatedUser);

        return res.status(httpStatus.OK).json({
            message: "User updated successfully",
            data: userResponse
        });

    } catch (error) {
        console.error("Error updating user:", error);
        if (error.code === 11000) {
            return res.status(httpStatus.CONFLICT).json({ message: "Email or username already exists." });
        }
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong: ${error.message}` });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid user ID" });
    }

    try {
        const sessionsToDelete = await Session.find({
            $or: [{ user: id }, { listener: id }]
        }).lean();

        if (sessionsToDelete.length > 0) {
            const sessionIds = sessionsToDelete.map(s => s._id);

            const otherUserIds = sessionsToDelete.reduce((acc, session) => {
                const userIdStr = id.toString();
                const otherUser = session.user.toString() !== userIdStr ? session.user : session.listener;
                acc.add(otherUser.toString());
                return acc;
            }, new Set());

            await User.updateMany(
                { _id: { $in: Array.from(otherUserIds) } },
                { $pull: { sessions: { $in: sessionIds } } }
            );

            await Session.deleteMany({ _id: { $in: sessionIds } });
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found, delete failed" });
        }

        return res.status(httpStatus.OK).json({
            message: "User and all associated sessions deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong: ${error.message}` });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query = { role: 'user' };

        const users = await User.find(query)
            .select("-password -token -__v")
            .skip(skip)
            .limit(limit)
            .lean();

        const totalUsers = await User.countDocuments(query);

        const transformedUsers = users.map(user => {
            return {
                _id: user._id,
                userId: user.username,
                alias: user.username,
                contact: {
                    email: user.email,
                    phone: `${user.cCode || ''} ${user.phoneNumber || ''}`.trim()
                },
                status: user.status,
                wallet: 0.00,
                sessions: user.sessions ? user.sessions.length : 0,
                registered: user.registered,
                lastActive: user.lastActive
            };
        });

        return res.status(httpStatus.OK).json({
            message: "Users fetched successfully",
            data: transformedUsers,
            pagination: {
                totalUsers,
                totalPages: Math.ceil(totalUsers / limit),
                currentPage: page,
                limit
            }
        });

    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong: ${error.message}` });
    }
};

export {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};