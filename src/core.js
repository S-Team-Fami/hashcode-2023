'use strict'

function allocateProjectsInRoadmap(projects) {
  const aaa =  Object.entries(projects)
  .map(([projectName, project]) => { return { projectName, project } })
  .sort((a, b) => b.project.score - a.project.score)
  .sort((a, b) => b.project.skillsNumber - a.project.skillsNumber)
  .sort((a, b) => a.project.days - b.project.days)
  .sort((a, b) => b.project.bestBefore - a.project.bestBefore)

  return aaa
}

function levelUpContributors(
  { projectName, peopleAssignedWithSkill },
  project,
  contributors
) {
    /*
    Anna: { 'C++': 5 }
    */
    Object.keys(peopleAssignedWithSkill).forEach(contributor => {
      const usedSkill = peopleAssignedWithSkill[contributor]
      // console.log('project', project)
      const skillLevelRequiredByProject = project.skills.find(skill => {
        // console.log('skill', skill, usedSkill)
        return skill.name === usedSkill
      }).level
      const skillLevelOfContributor = contributors[contributor][usedSkill]
      // console.log('skillLevelRequiredByProject', skillLevelRequiredByProject)
      // console.log('skillLevelOfContributor', skillLevelOfContributor)
      if (skillLevelOfContributor <= skillLevelRequiredByProject) {
        // console.log('level upped contributors', contributors)
        contributors[contributor][usedSkill] += 1
      }
    })
}

function allocateContributorsInProjects(contributors, projects, skills) {
  const notExecutedProjects = []
  const allocateContributorsInProjectsResult = projects.map(({ projectName, project }) => {
    const { skills: projectSkills } = project
    // console.log('projectSkills', projectSkills)
    // console.log('skills', skills)

    const { peopleAssigned, peopleAssignedWithSkill } = projectSkills.reduce((acc, { name, level }) => {
      const contributorsWithSkill = skills[name]
      // console.log('contributorsWithSkill', contributorsWithSkill)
      const findContributorByLevel = contributorsWithSkill.find(c => {
        return contributors[c][name] >= level
      })
      // console.log('findContributorByLevel', findContributorByLevel)
      if (findContributorByLevel && !acc.peopleAssigned.includes(findContributorByLevel)) {
        acc.peopleAssigned.push(findContributorByLevel)
        // console.log('findContributorByLevel', findContributorByLevel)
        acc.peopleAssignedWithSkill[findContributorByLevel] = name
      }
      return acc
    }, { peopleAssigned: [], peopleAssignedWithSkill: {} })

    if (peopleAssigned.length < project.skillsNumber) {
      notExecutedProjects.push(projectName)
      return {
        projectName,
        peopleAssigned: [],
        peopleAssignedWithSkill: {},
      }
    }


    const result = {
      projectName,
      peopleAssigned: peopleAssigned.filter(item => item),
      peopleAssignedWithSkill
    }
    levelUpContributors(result, project, contributors)
    // console.log('contributors', contributors)

    return result
  })
  const leftProjects = notExecutedProjects.reduce((acc, {projectName}) => {
    const foundProject = projects.find(currentProject => currentProject.projectName === projectName)
    if (foundProject) {
      acc.push(foundProject)
    }
    return acc
  }, [])
  if (notExecutedProjects.length > 0 && Object.keys(leftProjects).length !== Object.keys(projects).length) {
    console.log('notExecutedProjects', notExecutedProjects)

    const newAllocatedProjects = allocateContributorsInProjects(contributors, leftProjects, skills)
    return [ ...allocateContributorsInProjectsResult, ...newAllocatedProjects ]
  }
  return allocateContributorsInProjectsResult
}

// 3
// WebServer
// Bob Anna
// Logging
// Anna
// WebChat
// Maria Bob

function core(projects, contributors, skills) {
  const orderedProjects = allocateProjectsInRoadmap(projects)
  const contributorsInProjects = allocateContributorsInProjects(contributors, orderedProjects, skills)
  // console.log('contributorsInProjects', contributorsInProjects)
  const filteredContributorsInProjects = contributorsInProjects.filter(({ peopleAssigned }) => peopleAssigned.length > 0)

  // console.log('filteredContributorsInProjects', filteredContributorsInProjects)
  // filteredContributorsInProjects.map(projectEnded => {
  //   const { peopleAssignedWithSkill, projectName} = projectEnded
  //   levelUpContributors({projectName, peopleAssignedWithSkill}, projectEnded, contributors)
  // })

  // const temporaryDiscardedProject = contributorsInProjects.filter(peopleAssigned.length === 0)
  // console.log('temporaryDiscardedProject', temporaryDiscardedProject)

  // console.log('contributorsInProjects', filteredContributorsInProjects)
  return filteredContributorsInProjects
}


/*
  [
    {
      projectName: 'webServer',
      peopleAssigned: [
        'Bob',
        'Anna'
      ]
    },
    {
      projectName: 'Logging',
      peopleAssigned: [
        'Anna'
      ]
    },
    {
      projectName: 'webChat',
      peopleAssigned: [
        'Maria'
      ]
    }
  ]
*/


module.exports = {
  core,
  allocateContributorsInProjects,
  allocateProjectsInRoadmap,
}
