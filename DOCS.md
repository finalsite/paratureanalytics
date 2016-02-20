# Parature Analytics API
### API Resources
#### action
The 'action' resource represents an 'action' taken by a client.

##### Example:

When a client replies to a 'Need More Info' that's an action.

When a client rates a ticket response as a '4 Star Ticket Rating' that's an action.

##### Endpoint:
*URI Structure*: `http://{hostname}/api/v1/action`

*Method*: GET

*Parameters*:

| Key          | Option(s)                          |
| ------------ | ---------------------------------- |
| actionType   | 1 Star Ticket Rating               |
|              | 2 Star Ticket Rating               |
|              | 3 Star Ticket Rating               |
|              | 4 Star Ticket Rating               |
|              | Additional Info                    |
|              | Finalsite phone ticket created     |
|              | Progress Update Needed             |
|              | Provided Info                      |
|              | Reopened                           |
| assignedTo   | [CSR full name]                    |
| assignedFrom | [CSR full name]                    |
| dateMin      | [date string yyyy/mm/dd]           |
| dateMax      | [date string yyyy/mm/dd]           |
| ticketNumber | [Parature 7-digit ticket number]   |
| groupBy | 'day', 'month'   |
