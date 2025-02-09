const { ProjectMembers } = require("../models/models");

const checkRoleInProjectMiddleware = (req, res, next) => {
    try {
        const userId = req.user.id;
        const { projectId } = req.params;


        if (!userId) {
            return res.status(401).json({ message: "No auth" });
        }

        const infoAboutProjects = ProjectMembers.findAll({
            where: { projectId: projectId },
        });

        const infoAboutUser = infoAboutProjects.find((project) => project.userId === userId);

        if (!infoAboutUser) {
            return res.status(403).json({ message: "Access denied. You are not a member of this project." });
        }

        if (!infoAboutUser.role === "owner") {
            return res.status(400).json({ message: "You can`t add members to this project." });
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

module.exports = checkRoleInProjectMiddleware;