import Project from "../../models/project/Project";
import Sprint from "../../models/sprint/Sprint";
import Task from "../../models/task/Task";

export const updateSprintTotalStoryPoints = async (sprintId: string) => {
  const sprint = await Sprint.findById(sprintId);

  if (sprint) {
    const tasks = await Task.find({ SprintId: sprintId });
    let totalPoints = 0;

    tasks.map((item) => {
      totalPoints += item.StoryPoints;
    });

    sprint.TotalStoryPoints = totalPoints;
    return await sprint.save();
  }
};

export const updateProjectTotalStoryPoints = async (projectId: string) => {
  const project = await Project.findById(projectId);

  if (project) {
    const sprints = await Sprint.find({ ProjectId: projectId });
    let totalPoints = 0;
    sprints.map((item) => {
      totalPoints += item.TotalStoryPoints;
    });
    project.TotalStoryPoints = totalPoints;
    return await project.save();
  }
};
