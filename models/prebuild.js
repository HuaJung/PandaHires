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
    { name: '1st Interview', status: 'Scheduled' },
    { name: '1st Interview', status: 'To Be Rescheduled' },
    { name: '1st Interview', status: 'No Show' },
    { name: '1st Interview', status: 'Cancelled' },
    { name: '2nd Interview', status: 'Scheduled' },
    { name: '2nd Interview', status: 'To Be Rescheduled' },
    { name: '2nd Interview', status: 'No Show' },
    { name: '2nd Interview', status: 'Cancelled' },
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