import { Stage, StageRecord, JobCandidate } from "./db.js";



const addNewStageRecord = async (jobCandidateIdList, stage, interviewDate) => {
  const foundStage = await Stage.findOne({where: stage})
  if (!foundStage) return foundStage

  const stageRecordAttributes = []
  for (const id of jobCandidateIdList) {
    if (!await JobCandidate.findByPk(id)) throw {'message': 'Not a valid application'}

    const data = {
      jobCandidateId: id,
      stageId: foundStage.id,
      interviewDate: interviewDate
    }
    stageRecordAttributes.push(data)
  }
  return await StageRecord.bulkCreate(stageRecordAttributes)
}

export {addNewStageRecord}
