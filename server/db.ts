import e from "express"

const model = require('./model')

module.exports={
  updateUser: (objUpdate, callback) => {
    console.log(objUpdate)
    model.User.updateOne({userId:objUpdate.userId}, objUpdate.update)
      .exec()
      .then((data) => callback(null, data))
      .catch((err) =>callback(err))
  },
  createUser: (user, callback) => {
    model.User.create(user)
      .then((data) => {
        callback(null, data)
      })
      .catch((err) => {
        callback(err)
      })
  },
  findUser: (userId, callback) => {
    model.User.find({userId:userId})
      .exec()
      .then((data) => {
        callback(null, data)
      })
      .catch((err) => {
        console.log(err)
        callback(err)
      })
  },
  addPlant: (body, callback) => {
    let plant = body.plant
    model.Plant.findOne().sort({_id: -1})
    // model.Plant.countDocuments()
    .then((lastPlant) => {
      let count = 0;
      if (lastPlant === null) {
        count = 1;
      } else {
        count = lastPlant.plantId + 1
      }
      let plantCopy = JSON.parse(JSON.stringify(plant))
      plantCopy.plantId = count
      plantCopy.userId = body.userId
      model.Plant.create(plantCopy)
        .then((data) => {callback(null,data)})
        .catch((err) => {callback(err)})
    })
    .catch((err) =>{
      console.log('this is err', err)
    })
  },
  findPlant: (filter, callback) => {
    model.Plant.find(filter)
      .then((data) => {
        callback(null, data)
      })
      .catch((err) => {
        callback(err)
      })
  },
  updateWater: (objUpdate, callback) => {
    model.Plant.updateOne({plantId:objUpdate.plantId}, {lastWater: new Date()})
      .exec()
      .then((data) => callback(null, data))
      .catch((err) =>callback(err))
  },
  updateCaretaker: (objUpdate, callback) => {
    console.log('updating caretaker?', objUpdate);
    model.Plant.updateOne({plantId:objUpdate.plantId}, {careTakers: objUpdate.careTakers})
      .exec()
      .then((data) => callback(null, data))
      .catch((err) =>callback(err))
  },
  postMessage: (body, callback) => {
let message = {
  messageId : 1,
  messages:[JSON.parse(JSON.stringify(body).slice())],
  to: null
}
    if (!body) {
      message = {
        messageId:1,
        messages: [],
        to:null,
      }
    }
    if (message.messages[0]) {
      model.User.find({userId:message.messages[0].userId})
      .then((dataUser) => {
        message.messages[0].firstName = dataUser[0].firstName;
        message.messages[0].lastName = dataUser[0].lastName;
        if (message.messages[0].to) {
          message.to = JSON.parse(JSON.stringify(message.messages[0].to).slice())
          delete message.messages[0].to
        }
        console.log('thisis message', message)
        model.Messages.findOne().sort({_id: -1})
          .then((lastMessage) => {
            if (lastMessage === null) {
              console.log(message)
              model.Messages.create(message)
                .then((data) => callback(null, data))
                .catch((err) => {console.log(err)})
            } else {
              message.messageId = lastMessage.messageId + 1
              model.Messages.create(message)
                .then((data) => callback(null, data))
                .catch((err) => callback(err))
            }
          })
          .catch((err) => {callback(err)})
      })
    } else {
      model.Messages.findOne().sort({_id: -1})
          .then((lastMessage) => {
            if (lastMessage === null) {
              console.log(message)
              model.Messages.create(message)
                .then((data) => callback(null, data))
                .catch((err) => {console.log(err)})
            } else {
              message.messageId = lastMessage.messageId + 1
              model.Messages.create(message)
                .then((data) => callback(null, data))
                .catch((err) => callback(err))
            }
          })
          .catch((err) => {callback(err)})
    }
  },
  updateMessage: (body, callback) => {
    model.Messages.find({messageId:body.messageId})
      .then((data) => {
        let length = data[0].messages.length;
        let arrMessage = data[0].messages.slice()
        model.User.find({userId:body.message.userId})
          .exec()
          .then((dataUser) => {
            let objUpdate = JSON.parse(JSON.stringify(body.message).slice())
            objUpdate.count = length + 1;
            objUpdate.firstName = dataUser[0].firstName;
            objUpdate.lastName = dataUser[0].lastName;
            arrMessage.push(objUpdate)
            console.log('this is arrMessage: ', arrMessage)
            model.Messages.updateOne({messageId:body.messageId}, {messages:arrMessage})
             .then((data) => callback(null, data))
             .catch((err) => callback(err))
          })
          .catch((err) => {callback(err)})
      })
  },
  findMessage: (body, callback) => {
    model.Messages.find(body)
      .then((data) => {
        callback(null, data)
      })
      .catch((err) => {
        callback(err)
      })
  },
  postHousehold: (body, callback) => {
    model.Messages.create()
    model.Household.findOne().sort({_id: -1})
      .then((lastHousehold) => {
        let objHousehold = {
          householdName: body.household.householdName,
          photo: body.household.photo || null,
          members:[body.userId],
          messageId: body.messageId,
          householdId:1
        }
        if (lastHousehold !== null) {
          objHousehold.householdId = lastHousehold.householdId +1
        }
        model.Household.create(objHousehold)
          .then((data) => {
            callback(null, data)
          })
          .catch((err) => {
            callback(err)
          })
      })
  },
  findHousehold: (body, callback) => {
    model.Household.find(body)
      .then((data) => {callback(null,data)})
      .catch((err) => {callback(err)})
  },
  updateHousehold: (body, callback) => {
    if (body.update.messageId) {
      model.Household.updateOne({householdId:body.householdId}, body.update)
      .then((data) => {callback(null, data)})
      .catch((err) => {callback(err)})
    } else {
      console.log('body:', body);
      model.Household.updateOne({householdId:body.householdId}, {$addToSet: body.update})
      .then((data) => {callback(null, data)})
      .catch((err) => {callback(err)})
    }
  },
  postCommunity: (body, callback) => {
    model.Community.findOne().sort({_id: -1})
    .then((lastCommunity) => {
      let objCommunity = JSON.parse(JSON.stringify(body).slice())
      model.User.find({userId:body.userId})
        .then((dataUser) => {
          objCommunity.firstName = dataUser[0].firstName;
          objCommunity.lastName = dataUser[0].lastName;
          objCommunity.communityId = 1;
          if (lastCommunity !== null) {
            objCommunity.communityId = lastCommunity.communityId +1
          }
          model.Community.create(objCommunity)
            .then((data) => {
              callback(null, data)
            })
            .catch((err) => {
              callback(err)
            })
        })
        .catch((err) => {
          callback(err)
        })
    })
  },
  updateCommunity: (body, callback) => {
    if (body.update.messageId) {
      model.Community.updateOne({communityId:body.communityId}, body.update)
      .then((data) => {callback(null, data)})
      .catch((err) => {callback(err)})
    } else {
      // model.Community.updateOne({communityId:body.communityId}, {$addToSet: body.update})
      // .then((data) => {callback(null, data)})
      // .catch((err) => {callback(err)})
    }
  },
  findCommunity: (callback) => {
    model.Community.find()
      .then((data) => {callback(null,data)})
      .catch((err) => {callback(null)})
  },
  updateCommunityLikes: (communityId, callback) => {
    model.Community.updateOne(communityId, {$inc: {likes: 1}})
    .then((data) => {callback(null,data)})
    .catch((err) => {callback(err)})
  }
}

// {
//   "userId": "try1",
//   "firstName": "tryFN",
//   "lastName":"tryLN",
//   "email":"nate@gmail.com"
// }

// {
//   "userId":"try1",
//   "plant": {
//       "plantName":"tryPlant",
//       "plantType":"tryPlant",
//       "location":"tryPlant",
//       "careInstructions":"tryPlant",
//       "wateringSchedule":5
//   }
// }

// {
//   "messageId":1,
//   "message": {
//       "userId":"try1",
//       "time":"2023-03-04T23:43:12.539Z",
//       "message":"try this out"
//   }
// }

// {
//   "from": "try2",
//   "to": "try1",
//   "message": "gonnatry this",
//   "time":"2023-03-06T01:53:53.001Z"
//   }

