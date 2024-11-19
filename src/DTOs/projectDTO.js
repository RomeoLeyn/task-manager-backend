class ProjectDTO {
    constructor(project, createdByUser, members) {
        this.id = project.id
        this.title = project.title
        this.description = project.description
        this.createdByUser = createdByUser ? {
            id: createdByUser.id,
            username: createdByUser.username
        } : null
        this.members = members.map(member => ({
            id: member.id,
            username: member.username
        }))
        this.createdAt = project.createdAt
    }
}

module.exports = ProjectDTO;