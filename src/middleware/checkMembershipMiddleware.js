const { ProjectMembers } = require("../models/models");

const checkMembershipMiddleware = async (req, res, next) => {
    const userId = req.user.id;
    const { projectId } = req.params;
    console.log(projectId);

    if (!userId) {
        return res.status(401).json({ message: "No auth" });
    }

    const infoAboutProjects = await ProjectMembers.findAll({
        where: { projectId: projectId },
    });

    const infoAboutUser = infoAboutProjects.find((project) => project.userId === userId);

    if (!infoAboutUser) {
        return res.status(403).json({ error: 'Access denied. You are not a member of this project.' });
    }

    next();
}

module.exports = checkMembershipMiddleware;