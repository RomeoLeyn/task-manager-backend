class TaskDTO {

    constructor(task) {
        this.id = task.id
        this.title = task.title
        this.description = task.description
        this.status = task.status
        this.priority = task.priority
        this.dueDate = task.dueDate
    }
}

module.exports = TaskDTO;