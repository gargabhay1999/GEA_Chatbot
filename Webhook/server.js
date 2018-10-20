const express = require('express');
const session = require('express-session');
const ApiAiAssistant = require('actions-on-google').ApiAiAssistant;
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const Map = require('es6-map');
const {
  SimpleResponse,
  BasicCard,
  Image,
  Suggestions,
  Button,
  dialogflow, 
  RichResponse 
} = require('actions-on-google');
const prettyjson = require('prettyjson');
const toSentence = require('underscore.string/toSentence');

app.use(bodyParser.json({type: 'application/json'}));
app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

var model_num, serial_num, product_line, issue;
var name, email, phone, address, zipcode, user_otp, gea_otp;
var timings, day, start_time, end_time;
var tracking_num, tracking_num;
// Handle webhook requests
app.post('/', function(req, res, next) {
  logObject('Request headers: ', req.headers);
  logObject('Request body: ', req.body);

  const assistant = new ApiAiAssistant({request: req, response: res});
  
  const MODEL_NUM_PARAMETER = 'model_num';
  const SERIAL_NUM_PARAMETER = 'serial_num';
  const ISSUE_PARAMETER = 'issue';
  const NAME_PARAMETER = 'given-name';
  const EMAIL_PARAMETER = 'email';
  const PHONE_PARAMETER = 'phone-number';
  const ADDRESS_PARAMETER = 'address';
  const ZIPCODE_PARAMETER = 'zip-code';

  const WELCOME_ACTION = 'welcome';
  const GET_NAME_ACTION = 'userProvidesName';
  const BOOK_APPOINTMENT_ACTION = 'book_appointment';
  const GET_MODEL_SERIAL_ACTION = 'getmodelserial';
  const UPDATE_ISSUE_ACTION = 'issue';
  const GET_PERSONAL_DETAIL_ACTION = 'userProvidesDetails';
  const GET_ADDRESS_ACTION = 'userProvidesAddress';
  const GET_TIMINGS_ACTION = 'userSelectsTimings';
  const CHECK_STATUS_ACTION = 'checkStatus';
  const SHOW_STATUS_ACTION = 'userProvidesCheckStatusTrackingNumber';
  const RESCHEDULE_APPOINTMENT_ACTION = 'userRescheduleAppointment';
  //const GET_RESCHEDULED_TRACKING_NUMBER = 'userProvidesRescheduledTrackingNumber';
  const GET_RESCHEDULE_TIMING_ACTION = 'userProvidesRescheduledTimings';
  const DO_NOTHING_ACTION = 'userTypesDoNothing';
  const CANCEL_APPOINTMENT_ACTION = 'userCancelsAppointment';
  const USER_GOES_ACTION = 'userSaysThanksBye';
  const USER_FEEDBACK_ACTION = 'userProvidesFeedback';
  
  function welcome(assistant){
    console.log('Handling action: ' + WELCOME_ACTION);
    let ques = {
      "data": {
          "google": {
            "expectUserResponse": true,
            "richResponse": {
              "items": [
                {
                  "simpleResponse": {
                    "textToSpeech": "Welcome to GE Appliances, I am Kiki. May I know your name please?"
                  }
                }
              ]
            }
          }
        }        
    }
    res.send(JSON.stringify(ques));
  }
  
  function getName(assistant){
    console.log('Handling action: ' + GET_NAME_ACTION);
    name = assistant.getArgument('name');
    let ques = {
      "data": {
        "google": {
          "expectUserResponse": true,
          "richResponse": {
            "items": [
              {
                "simpleResponse": {
                  "textToSpeech": "Hi "+name+"! How may I help you today?"
                }
              }
            ],
            "suggestions": [
              {
                "title": "Book Service Appointment"
              },
              {
                "title": "Reschedule Appointment"
              },
              {
                "title": "Check Appointment Status"
              },
              {
                "title": "Cancel The Appointment"
              }
            ]
          }
        }
      }
    }
    res.send(JSON.stringify(ques));
  }
  
  function bookAppointment(assistant){
    console.log('Handling action: ' + BOOK_APPOINTMENT_ACTION);
    console.log("###############################################"+req.body.result.resolvedQuery);
    let ques = {
      "data": {
        "google": {
          "expectUserResponse": true,
          "richResponse": {
            "items": [
              {
                "simpleResponse": {
                  "textToSpeech": "Sure thing but I will need some details first."
                }
              },
              {
                "simpleResponse": {
                  "textToSpeech": "Tell me the model number of the appliance"
                }
              }
            ]
          }
        }
      }
    }
    res.send(JSON.stringify(ques));
  }
  
  function getmodelserial(assistant){
    console.log('Handling action: ' +  GET_MODEL_SERIAL_ACTION);
    model_num = assistant.getArgument(MODEL_NUM_PARAMETER);
    serial_num = assistant.getArgument(SERIAL_NUM_PARAMETER);
    let requestURL = 'https://presecure1.000webhostapp.com/validate_model_serial_num.php?model_num=' + model_num + '&serial_num=' + serial_num;
    request(requestURL, function(error, response) {
      if(error) {
        next(error);
      } else {        
        let body = JSON.parse(response.body);
        logObject('validateModel API call response: ', body);
        let valid = body[0]['valid'];
        if(valid == 1){          
          product_line = body[0]['product_line'];
          let ques = {
            "data": {
              "google": {
                "expectUserResponse": true,
                "richResponse": {
                  "items": [
                    {
                      "simpleResponse": {
                        "textToSpeech": "This model and serial number belong to " + product_line +"."
                      }
                    },
                    {
                      "simpleResponse": {
                        "textToSpeech": "So, what's the issue you are facing?\n\nPS: Nice Choice"
                      }
                    }
                  ]
                }
              }
            }
          }
          res.send(JSON.stringify(ques));
        }
        else{
          let ques = {
            "data": {
              "google": {
                "expectUserResponse": true,
                "richResponse": {
                  "items": [
                    {
                      "simpleResponse": {
                        "textToSpeech": "I couldn't find any product with this serial and model number. Can you please check it again?"
                      }
                    }
                  ],
                  "suggestions": [
                    {
                      "title": "Re-Enter Model Number"
                    },
                    {
                      "title": "Bye"
                    }
                  ]
                }
              }
            }
          }
          res.send(JSON.stringify(ques));
        }
      }
    });
  }
  function getissue(assistant){
    console.log('Handling action: ' +  UPDATE_ISSUE_ACTION);
    issue = assistant.getArgument(ISSUE_PARAMETER);
    assistant.ask("I think we can solve that.\nWhat's your email address? (We never use it to spam you)");
  }
  
  function getPersonalDetails(assistant){
    console.log('Handling action: ' +  GET_PERSONAL_DETAIL_ACTION);
    email = assistant.getArgument('email');
    if(email == null){
      assistant.ask("Sorry, I didn't get that. Can you please type your email address again?");
    }
    phone = assistant.getArgument('phone_num');
    if(phone == null){
      assistant.ask("Give me your mobile number. This will be used by the technician to contact you.");
    }
    user_otp = assistant.getArgument('otp');
    if(phone!=null && user_otp == null){
      gea_otp = Math.floor(Math.random()*9000) + 1000;
      var message = gea_otp + ' is your GE Appliance phone verification OTP. Use this OTP to book the appointment.' 
      let requestURL = "http://my.msgwow.com/api/sendhttp.php?authkey=AUTHORIZATION_KEY&mobiles="+phone+"&message="+encodeURI(message)+"&sender=IGEAPP&route=4";
      console.log(requestURL);
      request(requestURL, function(error, response) {
        if(error) {
          next(error);
        } else {
          console.log("OTP has been delivered successfully");
        }
      });
      assistant.ask("Enter the OTP sent to your mobile number: "+phone);
    }
    zipcode = assistant.getArgument('zipcode');
    if(phone!=null && user_otp != null && zipcode==null){
      if(gea_otp != user_otp){
        assistant.ask(app.request + "Please provide valid OTP");
      }
      else{
        assistant.ask("Mobile Number has been Verified.\n One more last thing please.\nEnter the zip code of your location");
      }
    }
    if(zipcode!=null){
      let requestURL = 'https://presecure1.000webhostapp.com/validate_zipcode.php?zipcode=' + zipcode;
      console.log(requestURL);
      request(requestURL, function(error, response) {
        if(error) {
          next(error);
        } else {        
          let body = JSON.parse(response.body);
          logObject('validateModel API call response: ', body);
          let valid = body[0]['valid'];
          if(valid == 1){
            let ques = {
              "data": {
                "google": {
                  "expectUserResponse": true,
                  "richResponse": {
                    "items": [
                      {
                        "simpleResponse": {
                          "textToSpeech": "Can you please provide your address? (Technician will come at this address)"
                        }
                      }
                    ]
                  }
                }
              }
            }
            res.send(JSON.stringify(ques));
          }
          else{
            let ques = {
              "data": {
                "google": {
                  "expectUserResponse": true,
                  "richResponse": {
                    "items": [
                      {
                        "simpleResponse": {
                          "textToSpeech": "Sorry, we do not provide service at this location."
                        }
                      }
                    ],
                    "suggestions": [
                      {
                        "title": "Book Service Appointment"
                      },
                      {
                        "title": "Reschedule Appointment"
                      },
                      {
                        "title": "Check Appointment Status"
                      },
                      {
                        "title": "Cancel The Appointment"
                      },
                      {
                        "title": "Bye"
                      }
                    ]
                  }
                }
              }
            }
            res.send(JSON.stringify(ques));
          }
        }
      });
    }
  }
  
  function getAddress(assistant){
    console.log('Handling action: ' +  GET_ADDRESS_ACTION);
    address = assistant.getArgument('address');
    let requestURL = 'https://presecure1.000webhostapp.com/available_slots_technicians.php?zipcode='+zipcode+'&tracking_num=';
    console.log(requestURL);
    request(requestURL, function(error, response) {
      if(error) {
        next(error);
      } else {
        let body = JSON.parse(response.body);
        console.log(body);
        logObject('validateModel API call response: ', body);
        let technicians_available = body[0]['technicians_available'];
        console.log(technicians_available);
        if(technicians_available > 0){
          var jsonArr = [];
          for (var i = 0; i < technicians_available; i++) {
              jsonArr.push({
                "title": body[1][i]['day']+', '+body[1][i]['start_time']+' - '+body[1][i]['end_time']
              });
          }
          let tech_str;
          if(technicians_available==1){
            tech_str = "One technician is available at your location.\n\nChoose a convinient time slot for the service appointment";
          }
          else{
            tech_str = technicians_available+" technicians are available at your location.\n\nChoose a convinient time slot for the service appointment";
          }
          let ques = {
            "data": {
              "google": {
                "expectUserResponse": true,
                "richResponse": {
                  "items": [
                    {
                      "simpleResponse": {
                        "textToSpeech": tech_str
                      }
                    }
                  ],
                  "suggestions": jsonArr,
                  "linkOutSuggestion": {
                    "destinationName": "Website",
                    "url": "https://assistant.google.com"
                  }
                }
              }
            }
          }
          res.send(JSON.stringify(ques));
        }
        else{
          let ques = {
            "data": {
              "google": {
                "expectUserResponse": true,
                "richResponse": {
                  "items": [
                    {
                      "simpleResponse": {
                        "textToSpeech": "Sorry, we do not provide service at this location."
                      }
                    }
                  ],
                  "suggestions": [
                    {
                      "title": "Book Service Appointment"
                    },
                    {
                      "title": "Reschedule Appointment"
                    },
                    {
                      "title": "Check Appointment Status"
                    },
                    {
                      "title": "Cancel The Appointment"
                    },
                    {
                      "title": "Bye"
                    }
                  ]
                }
              }
            }
          }
          res.send(JSON.stringify(ques));
        }
      }
    });
    
    /*requestURL = 'https://presecure1.000webhostapp.com/update_details.php?model_num='+model_num+'&serial_num='+serial_num+'&issue='+issue+'&name='+name+'&email='+email+'&phone='+phone+'&address='+address+'&zipcode='+zipcode
    console.log(requestURL);
    request(requestURL, function(error, response) {
      if(error) {
        next(error);
      } else {
        console.log("inserted successfully");
      }
    });*/
  }
  
  function getTimings(assistant){
    console.log('Handling action: getTimings');
    timings = assistant.getArgument('timings');
    let str = timings.split(",");
    let day = str[0];
    let startEnd = str[1];
    let startEndStr = startEnd.split("-");
    start_time = startEndStr[0];
    end_time = startEndStr[1];
    let appointment_time = day+", "+start_time+" - "+end_time;
    tracking_num = Math.floor(Math.random()*90000) + 10000;
    let requestURL = 'https://presecure1.000webhostapp.com/bookAppointment.php?model_num='+model_num+'&serial_num='+serial_num+'&issue='+issue+'&name='+name+'&email='+email+'&phone='+phone+'&address='+address+'&zipcode='+zipcode+'&day='+day+'&start_time='+start_time+'&end_time='+end_time+'&tracking_num='+tracking_num
    console.log(requestURL);
    request(requestURL, function(error, response) {
      if(error) {
        next(error);
      } else {
        console.log("personal and timings details inserted successfully");
      }
    });
    let ques={
      "data": {
        "google": {
          "expectUserResponse": true,
          "richResponse": {
            "items": [
              {
                "simpleResponse": {
                  "textToSpeech": "Booked! Our technician will be available at your provided address on "+appointment_time+".\n\nYour service appointment details are as follows"
                }
              },
              {
                "simpleResponse": {
                  "textToSpeech": "Tracking No.: "+tracking_num+"\n\nSerial No.: "+serial_num+"\nModel No.: "+model_num+"\nProduct: "+product_line+"\n\nStatus: Pending"+"\n\nIssue: "+issue+"\n\nTime: "+appointment_time+"\n\nAddress: "+address+"\nZipCode: "+zipcode+"\n\nMobile No.: "+phone
                }
              }
            ],
            "suggestions": [
              {
                "title": "Okay, Thank you. Bbye!!"
              },
              {
                "title": "Check Appointment Status"
              },
              {
                "title": "Reschedule Appointment"
              },
              {
                "title": "Cancel The Appointment"
              },
              {
                "title": "Book Service Appointment"
              }
            ],
            "linkOutSuggestion": {
              "destinationName": "Website",
              "url": "https://assistant.google.com"
            }
          }
        }
      }
    }
    res.send(JSON.stringify(ques));
  }
  
  function checkStatus(assistant){
    console.log('Handling action: checkStatus');
    assistant.ask("Tell me your 5 digits tracking number");
  }
  
  function showStatus(assistant){
    console.log('Handling action: showStatus');
    tracking_num = assistant.getArgument('tracking_number');
    let requestURL = "https://presecure1.000webhostapp.com/show_status.php?tracking_num="+tracking_num;
    console.log(requestURL);
    request(requestURL, function(error, response) {
      if(error) {
        next(error);
      } else {
        let body = JSON.parse(response.body);
        logObject('validateModel API call response: ', body);
        if(body[0]['valid']==1){
          status = body[0]['status'];
          product_line = body[0]['product_line'];
          let appointment_time = body[0]['day']+", "+body[0]['start_time']+" - "+body[0]['end_time'];
          address = body[0]['address'];
          zipcode = body[0]['zipcode'];
          serial_num = body[0]['serial_num'];
          model_num = body[0]['model_num'];
          issue = body[0]['issue'];
          phone = body[0]['phone'];
          let ques={
            "data": {
              "google": {
                "expectUserResponse": true,
                "richResponse": {
                  "items": [
                    {
                      "simpleResponse": {
                        "textToSpeech": "Service appointment details for tracking no. "+tracking_num+" are as follows:"
                      }
                    },
                    {
                      "simpleResponse": {
                        "textToSpeech": "Tracking No.: "+tracking_num+"\n\nSerial No.: "+serial_num+"\nModel No.: "+model_num+"\nProduct: "+product_line+"\n\nStatus: "+status+"\n\nIssue: "+issue+"\n\nTime: "+appointment_time+"\n\nAddress: "+address+"\nZipCode: "+zipcode+"\n\nMobile No.: "+phone
                      }
                    }
                  ],
                  "suggestions": [
                    {
                      "title": "Thanks, That's it for now"
                    },
                    {
                      "title": "Reschedule Appointment"
                    },
                    {
                      "title": "Cancel The Appointment"
                    },
                    {
                      "title": "Book Service Appointment"
                    },
                    {
                      "title": "Check Appointment Status"
                    }
                  ],
                  "linkOutSuggestion": {
                    "destinationName": "Website",
                    "url": "https://assistant.google.com"
                  }
                }
              }
            }
          }
          console.log(ques);
          res.send(JSON.stringify(ques));
        }
        else{
          let ques = {
            "data": {
                "google": {
                  "expectUserResponse": true,
                  "richResponse": {
                    "items": [
                      {
                        "simpleResponse": {
                          "textToSpeech": "I couldn't find any appointment with this tracking no. Can you please check it again?"
                        }
                      }
                    ],
                    "suggestions": [
                      {
                        "title": "Re-Type Tracking Number"
                      },
                      {
                        "title": "Book Service Appointment"
                      },
                      {
                        "title": "Reschedule Appointment"
                      },
                      {
                        "title": "Cancel The Appointment"
                      }
                    ]
                  }
                }
              }        
          }
          res.send(JSON.stringify(ques));
        }
      }
    });
  }
  
  /*function rescheduleAppointment(assistant){
    console.log('Handling action: rescheduleAppointment');
    assistant.ask("Tell me your 5 digits tracking number");
  }*/
  
  function getRescheduledTrackingNumber(assistant) {
    console.log('Handling action: getRescheduledTrackingNumber');
    tracking_num = assistant.getArgument('tracking_number');
    let requestURL = 'https://presecure1.000webhostapp.com/rescheduled_available_slots_technicians.php?tracking_num='+tracking_num;
    console.log(requestURL);
    request(requestURL, function(error, response) {
      if(error) {
        next(error);
      } else {
        let body = JSON.parse(response.body);
        console.log(body);
        logObject('validateModel API call response: ', body);
        console.log(body[0]['valid']);
        if(body[0]['valid']==1){
          if(body[0]['status']=='Finished'){
            let ques = {
              "data": {
                  "google": {
                    "expectUserResponse": true,
                    "richResponse": {
                      "items": [
                        {
                          "simpleResponse": {
                            "textToSpeech": "For this tracking number, service appointment has been already successfully finished."
                          }
                        }
                      ],
                      "suggestions": [
                        {
                          "title": "Ok, Thanks!!"
                        },
                        {
                          "title": "Book an Appointment"
                        },
                        {
                          "title": "Check Appointment Status"
                        },
                        {
                          "title": "Cancel the Appointment"
                        },
                        {
                          "title": "Reschedule Appointment"
                        }
                      ]
                    }
                  }
                }        
            }
            res.send(JSON.stringify(ques));
          }
          else if(body[0]['cancelled']==0){
            let technicians_available = body[0]['technicians_available'];
            if(technicians_available > 0){
              var jsonArr = [];
              for (var i = 0; i < technicians_available; i++) {
                  jsonArr.push({
                    "title": body[1][i]['day']+', '+body[1][i]['start_time']+' - '+body[1][i]['end_time']
                  });
              }
              let ques = {
                "data": {
                  "google": {
                    "expectUserResponse": true,
                    "richResponse": {
                      "items": [
                        {
                          "simpleResponse": {
                            "textToSpeech": "Following alternative slots are available. Please select as per your convinience"
                          }
                        }
                      ],
                      "suggestions": jsonArr,
                      "linkOutSuggestion": {
                        "destinationName": "Website",
                        "url": "https://assistant.google.com"
                      }
                    }
                  }
                }
              }
              console.log("ques is: "+ques);
              res.send(JSON.stringify(ques));
            }
            else{
              let ques = {
                "data": {
                  "google": {
                    "expectUserResponse": true,
                    "richResponse": {
                      "items": [
                        {
                          "simpleResponse": {
                            "textToSpeech": "Sorry, no other slots are available."
                          }
                        }
                      ],
                      "suggestions": [
                        {
                          "title": "It's okay. Do nothing."
                        },
                        {
                          "title": "Cancel this appointment"
                        }
                      ]
                    }
                  }
                }
              }
              res.send(JSON.stringify(ques));
            }
          }
          else if(body[0]['cancelled']==1){
            let ques = {
              "data": {
                  "google": {
                    "expectUserResponse": true,
                    "richResponse": {
                      "items": [
                        {
                          "simpleResponse": {
                            "textToSpeech": "For this tracking number, service appointment has been already cancelled. So, I can't reschedule the appointment."
                          }
                        }
                      ],
                      "suggestions": [
                        {
                          "title": "Okay, Thank you!!"
                        },
                        {
                          "title": "Book an Appointment"
                        },
                        {
                          "title": "Check Appointment Status"
                        },
                        {
                          "title": "Cancel the Appointment"
                        },
                        {
                          "title": "Reschedule Appointment"
                        }
                      ]
                    }
                  }
                }        
            }
            res.send(JSON.stringify(ques));
          }      
        }
        else{
          let ques = {
            "data": {
                "google": {
                  "expectUserResponse": true,
                  "richResponse": {
                    "items": [
                      {
                        "simpleResponse": {
                          "textToSpeech": "I couldn't find any appointment with this tracking number. Can you please check it again?"
                        }
                      }
                    ],
                    "suggestions": [
                      {
                        "title": "Re-Enter Tracking Number"
                      },
                      {
                        "title": "Book Service Appointment"
                      },
                      {
                        "title": "Reschedule Appointment"
                      },
                      {
                        "title": "Cancel The Appointment"
                      }
                    ]
                  }
                }
              }        
          }
          res.send(JSON.stringify(ques));
        }
      }
    });
  }
  
  function getRescheduledTimings(assistant){
    console.log('Handling action: getRescheduledTimings');
    let rescheduled_timings = assistant.getArgument('rescheduled_timings');
    let str = rescheduled_timings.split(",");
    let day = str[0];
    let startEnd = str[1];
    let startEndStr = startEnd.split("-");
    start_time = startEndStr[0];
    end_time = startEndStr[1];
    let a=0;
    let requestURL = 'https://presecure1.000webhostapp.com/reschedule_appointment.php?tracking_num='+tracking_num+'&day='+day+'&start_time='+start_time+'&end_time='+end_time
    console.log(requestURL);
    request(requestURL, function(error, response) {
      if(error) {
        next(error);
      } else {
        let body = JSON.parse(response.body);
          logObject('validateModel API call response: ', body);
          console.log(body);
          if(body[0]['status'] != 'Cancel'){
            product_line = body[0]['product_line'];
            status = body[0]['status'];
            let appointment_time = body[0]['day']+", "+body[0]['start_time']+" - "+body[0]['end_time'];
            address = body[0]['address'];
            zipcode = body[0]['zipcode'];
            serial_num = body[0]['serial_num'];
            model_num = body[0]['model_num'];
            issue = body[0]['issue'];
            phone = body[0]['phone'];
            let ques={
              "data": {
                "google": {
                  "expectUserResponse": true,
                  "richResponse": {
                    "items": [
                      {
                        "simpleResponse": {
                          "textToSpeech": "Service appointment details for tracking no. "+tracking_num+" are as follows:"
                        }
                      },
                      {
                        "simpleResponse": {
                          "textToSpeech": "Tracking No.: "+tracking_num+"\n\nSerial No.: "+serial_num+"\nModel No.: "+model_num+"\nProduct: "+product_line+"\n\nStatus: Pending"+"\n\nIssue: "+issue+"\n\nTime: "+appointment_time+"\n\nAddress: "+address+"\nZipCode: "+zipcode+"\n\nMobile No.: "+phone
                        }
                      }
                    ],
                    "suggestions": [
                      {
                        "title": "Thanks, That's it for now"
                      },
                      {
                        "title": "Cancel The Appointment"
                      },
                      {
                        "title": "Check Appointment Status"
                      },
                      {
                        "title": "Book Service Appointment"
                      },
                      {
                        "title": "Reschedule Appointment"
                      }
                    ],
                    "linkOutSuggestion": {
                      "destinationName": "Website",
                      "url": "https://assistant.google.com"
                    }
                  }
                }
              }
            }
            res.send(JSON.stringify(ques));
          }
          else if(body[0]['status']== 'Cancel'){
            let ques = {
            "data": {
                "google": {
                  "expectUserResponse": true,
                  "richResponse": {
                    "items": [
                      {
                        "simpleResponse": {
                          "textToSpeech": "Appointment for this tracking number has been already cancelled by the user, so can't reschedule this appointment."
                        }
                      }
                    ],
                    "suggestions": [
                      {
                        "title": "Okay, thanks!"
                      },
                      {
                        "title": "Cancel The Appointment"
                      },
                      {
                        "title": "Check Appointment Status"
                      },
                      {
                        "title": "Book Service Appointment"
                      },
                      {
                        "title": "Reschedule Appointment"
                      }
                    ]
                  }
                }
              }        
          }
          res.send(JSON.stringify(ques));
        }
      }
    });
  }
  
  function userTypesDoNothing(assistant){
    console.log('Handling action: userTypesDoNothing');
    let ques = {
      "data": {
        "google": {
          "expectUserResponse": true,
          "richResponse": {
            "items": [
              {
                "simpleResponse": {
                  "textToSpeech": "Roger that. Anything else you would like me to do?"
                }
              }
            ],
            "suggestions": [
              {
                "title": "Thanks, That's it for now"
              },
              {
                "title": "Book Service Appointment"
              },
              {
                "title": "Reschedule Appointment"
              },
              {
                "title": "Check Appointment Status"
              },
              {
                "title": "Cancel The Appointment"
              }
            ]
          }
        }
      }
    }
    res.send(JSON.stringify(ques));
  }
  /*function cancelAppointment(assistant){
    console.log('Handling action: cancelAppointment');
    let tracking_num = assistant.getArgument('tracking_num');
    if(tracking_num!=null){
      let requestURL = 'https://presecure1.000webhostapp.com/validate_tracking_num.php?tracking_num='+tracking_num
      console.log(requestURL);
      request(requestURL, function(error, response) {
      if(error) {
        next(error);
      }
      else {
        let body = JSON.parse(response.body);
        logObject('validateModel API call response: ', body);
        console.log(body);
        //console.log(body['valid']);
        assistant.ask(body['valid'] + body['cancelled'] + body['finished'] );
        /*if(body[0]['valid']==1 && body[0]['cancelled']==0 && body[0]['finished']==0){
          assistant.ask("Why do you want to cancel this appointment?");
        }
        else if(body[0]['valid']==1 && body[0]['cancelled']==0 && body[0]['finished']==1){
          let ques = {
            "data": {
                "google": {
                  "expectUserResponse": true,
                  "richResponse": {
                    "items": [
                      {
                        "simpleResponse": {
                          "textToSpeech": "Done."
                        }
                      },
                      {
                        "simpleResponse": {
                          "textToSpeech": "Your service appointment with tracking number "+tracking_num+" has been already finished. \n\nAnything else you would like me to do?"
                        }
                      }
                    ],
                    "suggestions": [
                      {
                        "titile": "Thanks, That's it for now"
                      },
                      {
                        "title": "Book Service Appointment"
                      },
                      {
                        "title": "Reschedule Appointment"
                      },
                      {
                        "title": "Check Appointment Status"
                      },
                      {
                        "title": "Cancel The Appointment"
                      }
                    ]
                  }
                }
              }        
          }
          res.send(JSON.stringify(ques));
        }
        else if(body[0]['valid']==1 && body[0]['cancelled']==1 && body[0]['finished']==0){
          let ques = {
            "data": {
                "google": {
                  "expectUserResponse": true,
                  "richResponse": {
                    "items": [
                      {
                        "simpleResponse": {
                          "textToSpeech": "Done."
                        }
                      },
                      {
                        "simpleResponse": {
                          "textToSpeech": "Your service appointment with tracking number "+tracking_num+" has been already cancelled. \n\nAnything else you would like me to do?"
                        }
                      }
                    ],
                    "suggestions": [
                      {
                        "titile": "Thanks, That's it for now"
                      },
                      {
                        "title": "Book Service Appointment"
                      },
                      {
                        "title": "Reschedule Appointment"
                      },
                      {
                        "title": "Check Appointment Status"
                      },
                      {
                        "title": "Cancel The Appointment"
                      }
                    ]
                  }
                }
              }        
          }
          res.send(JSON.stringify(ques));
        }
        else if (body[0]['valid']==0){
          let ques = {
            "data": {
                "google": {
                  "expectUserResponse": true,
                  "richResponse": {
                    "items": [
                      {
                        "simpleResponse": {
                          "textToSpeech": "I couldn't find any appointment with this tracking number. Can you please check it again?"
                        }
                      }
                    ],
                    "suggestions": [
                      {
                        "title": "Retype Tracking No."
                      },
                      {
                        "title": "Book Service Appointment"
                      },
                      {
                        "title": "Reschedule Appointment"
                      },
                      {
                        "title": "Cancel The Appointment"
                      }
                    ]
                  }
                }
              }        
          }
          res.send(JSON.stringify(ques));
        }
      }
      });
    }
    else if(tracking_num==null){
      assistant.ask("Tell me your 5 digits tracking number");
    }
    
    let cancellation_reason = assistant.getArgument('cancellation_reason');
    if(cancellation_reason!=null){
      let requestURL = 'https://presecure1.000webhostapp.com/cancel_appointment.php?tracking_num='+tracking_num+'&cancellation_reason='+cancellation_reason
      console.log(requestURL);
      request(requestURL, function(error, response) {
        if(error) {
          next(error);
        } else {
          let body = JSON.parse(response.body);
          logObject('validateModel API call response: ', body);
          if(body[0]['valid']==1){
            if(body[0]['cancelled']==0){
              let ques = {
                "data": {
                    "google": {
                      "expectUserResponse": true,
                      "richResponse": {
                        "items": [
                          {
                            "simpleResponse": {
                              "textToSpeech": "Done."
                            }
                          },
                          {
                            "simpleResponse": {
                              "textToSpeech": "Your service appointment with tracking number "+tracking_num+" has been cancelled. \n\nAnything else you would like me to do?"
                            }
                          }
                        ],
                        "suggestions": [
                          {
                            "titile": "Thanks, That's it for now"
                          },
                          {
                            "title": "Book Service Appointment"
                          },
                          {
                            "title": "Reschedule Appointment"
                          },
                          {
                            "title": "Check Appointment Status"
                          },
                          {
                            "title": "Cancel The Appointment"
                          }
                        ]
                      }
                    }
                  }        
              }
              res.send(JSON.stringify(ques));
            }
            else{
              let ques = {
                "data": {
                    "google": {
                      "expectUserResponse": true,
                      "richResponse": {
                        "items": [
                          {
                            "simpleResponse": {
                              "textToSpeech": "For this tracking number, service appointment has been already cancelled."
                            }
                          }
                        ],
                        "suggestions": [
                          {
                            "title": "Okay, Thanks!! Bye"
                          },
                          {
                            "title": "Book an Appointment"
                          },
                          {
                            "title": "Check Appointment Status"
                          },
                          {
                            "title": "Reschedule Appointment"
                          }
                        ]
                      }
                    }
                  }        
              }
              res.send(JSON.stringify(ques));
            }
          }
          else{
            let ques = {
              "data": {
                  "google": {
                    "expectUserResponse": true,
                    "richResponse": {
                      "items": [
                        {
                          "simpleResponse": {
                            "textToSpeech": "I couldn't find any appointment with this tracking number. Can you please check it again?"
                          }
                        }
                      ],
                      "suggestions": [
                        {
                          "title": "Retype Tracking No."
                        },
                        {
                          "title": "Book Service Appointment"
                        },
                        {
                          "title": "Reschedule Appointment"
                        },
                        {
                          "title": "Cancel The Appointment"
                        }
                      ]
                    }
                  }
                }        
            }
            res.send(JSON.stringify(ques));
          }
        }
      }); 
    }
    else if(cancellation_reason==null){
      assistant.ask("Why do you want to cancel this appointment?");
    }
  }*/
  
  function cancelAppointment(assistant){
    console.log('Handling action: cancelAppointment');
    tracking_num = assistant.getArgument('tracking_num');
    let cancellation_reason = assistant.getArgument('cancellation_reason');
    let requestURL = 'https://presecure1.000webhostapp.com/cancel_appointment.php?tracking_num='+tracking_num+'&cancellation_reason='+cancellation_reason
    console.log(requestURL);
    request(requestURL, function(error, response) {
      if(error) {
        next(error);
      } else {
        let body = JSON.parse(response.body);
        logObject('validateModel API call response: ', body);
        if(body[0]['valid']==1){
          if(body[0]['cancelled']==0){
            let ques = {
              "data": {
                  "google": {
                    "expectUserResponse": true,
                    "richResponse": {
                      "items": [
                        {
                          "simpleResponse": {
                            "textToSpeech": "Done."
                          }
                        },
                        {
                          "simpleResponse": {
                            "textToSpeech": "Your service appointment with tracking number "+tracking_num+" has been cancelled. \n\nAnything else you would like me to do?"
                          }
                        }
                      ],
                      "suggestions": [
                        {
                          "title": "Thanks, That's it for now"
                        },
                        {
                          "title": "Book Service Appointment"
                        },
                        {
                          "title": "Reschedule Appointment"
                        },
                        {
                          "title": "Check Appointment Status"
                        },
                        {
                          "title": "Cancel The Appointment"
                        }
                      ]
                    }
                  }
                }        
            }
            res.send(JSON.stringify(ques));
          }
          else{
            let ques = {
              "data": {
                  "google": {
                    "expectUserResponse": true,
                    "richResponse": {
                      "items": [
                        {
                          "simpleResponse": {
                            "textToSpeech": "For this tracking number, service appointment has been already cancelled."
                          }
                        }
                      ],
                      "suggestions": [
                        {
                          "title": "Okay, Thanks!! Bye"
                        },
                        {
                          "title": "Book an Appointment"
                        },
                        {
                          "title": "Check Appointment Status"
                        },
                        {
                          "title": "Reschedule Appointment"
                        }
                      ]
                    }
                  }
                }        
            }
            res.send(JSON.stringify(ques));
          }
        }
        else{
          let ques = {
            "data": {
                "google": {
                  "expectUserResponse": true,
                  "richResponse": {
                    "items": [
                      {
                        "simpleResponse": {
                          "textToSpeech": "I Couldn't find any appointment with this tracking number. Can you please check it again?"
                        }
                      }
                    ],
                    "suggestions": [
                      {
                        "title": "Retype Tracking No."
                      },
                      {
                        "title": "Book Service Appointment"
                      },
                      {
                        "title": "Reschedule Appointment"
                      },
                      {
                        "title": "Cancel The Appointment"
                      }
                    ]
                  }
                }
              }        
          }
          res.send(JSON.stringify(ques));
        }
      }
    });
  }
  
  function getFeedback(assistant){
    console.log('Handling action: cancelAppointment');
    let feedback = assistant.getArgument('feedback');
    let requestURL = 'https://presecure1.000webhostapp.com/feedback.php?feedback='+feedback+'&tracking_num='+tracking_num;
    console.log(requestURL);
    request(requestURL, function(error, response) {
      if(error) {
        next(error);
      } else {
        assistant.tell("We value your feedback.\n\nThank you for choosing GE Appliances services.");
      }
    });
  }
  /*function askForRatings(assistant){
    let ques = {
      "data": {
          "google": {
            "expectUserResponse": true,
            "richResponse": {
              "items": [
                {
                  "simpleResponse": {
                    "textToSpeech": "How much are you satisfied with our services?"
                  }
                }
              ],
              "suggestions": [
                {
                  "title": "Very Satisfied"
                },
                {
                  "title": "Satisfied"
                },
                {
                  "title": "Not Satisfied"
                }
              ]
            }
          }
        }        
    }
    res.send(JSON.stringify(ques));
  }*/
  
  let actionRouter = new Map();
  actionRouter.set(WELCOME_ACTION, welcome);
  actionRouter.set(GET_NAME_ACTION, getName);
  actionRouter.set(BOOK_APPOINTMENT_ACTION, bookAppointment);
  actionRouter.set(GET_MODEL_SERIAL_ACTION, getmodelserial);
  actionRouter.set(UPDATE_ISSUE_ACTION, getissue);
  actionRouter.set(GET_PERSONAL_DETAIL_ACTION, getPersonalDetails);
  actionRouter.set(GET_ADDRESS_ACTION, getAddress);
  actionRouter.set(GET_TIMINGS_ACTION, getTimings);
  actionRouter.set(CHECK_STATUS_ACTION, checkStatus);
  actionRouter.set(SHOW_STATUS_ACTION, showStatus);
  //actionRouter.set(RESCHEDULE_APPOINTMENT_ACTION, rescheduleAppointment);
  actionRouter.set(RESCHEDULE_APPOINTMENT_ACTION, getRescheduledTrackingNumber);
  actionRouter.set(GET_RESCHEDULE_TIMING_ACTION, getRescheduledTimings);
  actionRouter.set(DO_NOTHING_ACTION, userTypesDoNothing);
  actionRouter.set(CANCEL_APPOINTMENT_ACTION, cancelAppointment);
  //actionRouter.set(USER_GOES_ACTION, askForRatings);
  actionRouter.set(USER_FEEDBACK_ACTION, getFeedback);
  assistant.handleRequest(actionRouter);
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

function logObject(message, object, options) {
  console.log(message);
  console.log(prettyjson.render(object, options));
}

let server = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + server.address().port);
});
