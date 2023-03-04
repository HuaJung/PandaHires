import { Stage } from "./db.js "

const prebuildSatgeModel = async (req, res) => {
  await Stage.bulkCreate([
    { name: 'New Application' },
    { name: 'Forwarded' },
    { name: 'Not Consider' },
    { name: 'Under Consideration' },
    { name: 'Contacted' },
    { name: 'Interview', status: 'Scheduled' },
    { name: 'Interview', status: 'To Be Rescheduled' },
    { name: 'Interview', status: 'No Show' },
    { name: 'Interview', status: 'Cancelled' },
    { name: 'First Interview', status: 'Scheduled' },
    { name: 'First Interview', status: 'To Be Rescheduled' },
    { name: 'First Interview', status: 'No Show' },
    { name: 'First Interview', status: 'Cancelled' },
    { name: 'Second Interview', status: 'Scheduled' },
    { name: 'Second Interview', status: 'To Be Rescheduled' },
    { name: 'Second Interview', status: 'No Show' },
    { name: 'Second Interview', status: 'Cancelled' },
    { name: 'Final Interview', status: 'Scheduled' },
    { name: 'Final Interview', status: 'To Be Rescheduled' },
    { name: 'Final Interview', status: 'No Show' },
    { name: 'Final Interview', status: 'Cancelled' },
    { name: 'Offered'},
    { name: 'Rejected'},
    { name: 'On Hold'}
  ])
}



export {prebuildSatgeModel}