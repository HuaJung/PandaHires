import { QueryTypes } from "sequelize";
import { sequelize } from "./dbConn.js";



const allJobs = async (offerStage, userID, limit, offset) => {
  const allJobsInterviewOfferCount = await sequelize.query( 
    `WITH interviewCounts AS (
      SELECT jc.jobId, COUNT(*) AS interviewCount
      FROM (
        SELECT jobCandidateId, MAX(sr.createdAt) AS latestValidInterview
        FROM stageRecords sr
        WHERE sr.stageId = 6 OR sr.stageId = 10 OR sr.stageId = 14 OR sr.stageId = 18
        GROUP BY jobCandidateId
      ) AS latestInterviewRecords
      INNER JOIN jobCandidates jc ON jc.id = latestInterviewRecords.jobCandidateId
      GROUP BY jc.jobId
    ),
    offerCounts AS (
      SELECT jc.jobId, COUNT(*) AS offerCount
      FROM stageRecords sr
      INNER JOIN stages ON sr.stageId = stages.id
      INNER JOIN jobCandidates jc ON jc.id = sr.jobCandidateId
      WHERE stages.id = ?
      GROUP BY jc.jobId
    )
    SELECT j.id, j.team, j.name, j.workType, j.employmentType, j.updatedAt,
      COALESCE(COUNT(jc.candidateId), 0) AS applicants,
      COALESCE(ic.interviewCount, 0) AS interviewCount,
      COALESCE(oc.offerCount, 0) AS offerCount
    FROM jobs j
    LEFT JOIN interviewCounts ic ON ic.jobId = j.id
    LEFT JOIN offerCounts oc ON oc.jobId = j.id
    LEFT JOIN jobCandidates jc ON j.id = jc.jobId
    INNER JOIN companies c ON j.companyId = c.id
    INNER JOIN users u ON u.id = c.userId
    WHERE c.userId = ? AND j.status = 'Open'
    GROUP BY j.id
    ORDER BY j.updatedAt DESC
    LIMIT ? OFFSET ?
    `,
   {
    replacements:[offerStage, userID, limit, offset],
    type: QueryTypes.SELECT
  })

  if (allJobsInterviewOfferCount.length < 1) {
    return allJobsInterviewOfferCount 
  } else {
    const jobsByTeam = allJobsInterviewOfferCount.reduce((acc, job) => {
      if (!acc[job.team]) {
        acc[job.team] = { team: job.team, jobs: [] };
      }
      acc[job.team].jobs.push({
        id: job.id,
        name: job.name,
        workType: job.workType,
        employmentType: job.employmentType,
        updatedAt: job.updatedAt,
        applicants: job.applicants,
        interviewCount: job.interviewCount,
        offerCount: job.offerCount,
      });
      return acc;
    }, {});
    const sortedJobs = Object.values(jobsByTeam).sort((a, b) => a.team.localeCompare(b.team));
    return sortedJobs
  }
}

const overviewJobs = async (userID) => {
  const applicantInterviewOfferCount = await sequelize.query(
    `SELECT jobs.id, jobs.name,
    COUNT(DISTINCT CASE WHEN DATE(jc.createdAt) = CURDATE() THEN jc.id END) AS applicantToday, 
    COUNT(DISTINCT CASE WHEN jc.createdAt >= CURDATE() - INTERVAL 7 DAY THEN jc.id END) AS applicantPast7Day,
    COUNT(DISTINCT CASE WHEN sr.interviewDate = CURDATE() THEN sr.jobCandidateId END) AS interviewToday,
    COUNT(DISTINCT CASE WHEN sr.interviewDate > CURDATE() AND sr.interviewDate <= CURDATE() + INTERVAL 7 DAY THEN sr.jobCandidateId END) AS interviewNext7Day,
    COUNT(DISTINCT CASE WHEN sr.stageId = 26 AND sr.createdAt >= CURDATE() - INTERVAL 7 DAY THEN sr.jobCandidateId END) AS offerPast7Day
    FROM jobCandidates jc
    RIGHT JOIN jobs ON jc.jobId = jobs.id 
    LEFT JOIN stageRecords sr ON jc.id = sr.jobCandidateId
    INNER JOIN companies ON companies.id = jobs.companyId
    WHERE jobs.companyId = ? AND jobs.status = 'Open'
    GROUP BY jobs.id, jobs.name WITH ROLLUP`,
    {
      replacements:[userID],
      type: QueryTypes.SELECT
    }
  )
  if (applicantInterviewOfferCount.length < 1) {
    return applicantInterviewOfferCount
  } else {
    const total = applicantInterviewOfferCount.pop()
    delete total.id
    delete total.name
  
    const overview = applicantInterviewOfferCount.filter(obj => obj.name !== null)

    return {"total": total, "jobs": overview}
  }
}

export {allJobs, overviewJobs}