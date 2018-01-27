const _ = require('lodash');
const Path = require('path-parser');
const { URL } = require('url');  // built in node module
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

// Note we could've taken a differnet approach and directly require in
// the Survey.js file but there is a problem with mongoose that occurs
// with some testing frameworks where it complains if you  attempt to
// require in a mongoose model file multiple times.
const Survey = mongoose.model('surveys');

// Wildcards in the route.
module.exports = app => {
    app.get('/api/surveys', requireLogin, async (req, res) => {
        const surveys = await Survey.find({ _user: req.user.id }).select({ 
            recipients: false });  // exclude the giant list of recipients from the query.

        res.send(surveys);
    });

    app.get('/api/surveys/:surveyId/:choice', (req, res) => {
        res.send('Thanks for voting!');
    });

    app.post('/api/surveys/webhooks', (req, res) => {

        // The URL sent by webhooks from sendgrid will be in the
        // format http://domainName/api/surveys/"surveyId"/"choice"
        // so we want to extract the choice and survey name from the
        // url. The p here is a parser telling the Path-parser to
        // parse these two fields from the url
        const p = new Path('/api/surveys/:surveyId/:choice');

        // Iterate through all the events sent by webhooks
        /*const events  = _.map(req.body, ({email, url}) => {
            
            const match = p.test(new URL(url).pathname);

            // if match is found wee return a new object with the 
            // email, survey ID and choice (yes/no). If a match is not
            // found, by default, undefined will be returned.
            if (match) {
                return {
                    email,
                    surveyId: match.surveyId,
                    choice: match.choice
                };
            }
        });

        // Remove all the "undefined" elements from the array.
        const compactEvents = _.compact(events);

        // Look for unique elements in the array, i.e. unique email and
        // survey ID
        const uniqueEvents = _.uniqBy(compactEvents, 'email', 'surveyId'); */

        // Same as above but with chain.
        _.chain(req.body)
        .map( ({ email, url }) => {
            const match = p.test(new URL(url).pathname);

            // if match is found wee return a new object with the 
            // email, survey ID and choice (yes/no). If a match is not
            // found, by default, undefined will be returned.
            if (match) {
                return { email, surveyId: match.surveyId, choice: match.choice };
            }
        })
        .compact()
        .uniqBy('email', 'surveyId')
        .each( ({ surveyId, email, choice }) => {     // destructure
            // Note updateOne is asynchronous. But we don't care about waiting
            // for it to finish. As soon as we issue this updateOne, we can
            // just send a response back to sendGrid, (sending an empty object
            // back as below) without waiting for the operation to finish
            Survey.updateOne( { 
                _id: surveyId,
                recipients: {
                    $elemMatch: { email: email, responded: false }    // find one element in the recipients sub collection matching this criteria
                }
            }, {                          // This second argument is what we update the collection with.
                $inc: { [choice]: 1},     // note [choice] is just a key interpolation. This says increment either the 'yes' or 'no', i.e. the choice by 1.
                $set: { 'recipients.$.responded': true},     //  set the recipientts sub collection found above to true. The $ means we change the recipients sub collection found above
                      lastResponded: new Date()
            }).exec();                                      // exec just executes this transaction
        })
        .value();


        res.send({}); // just reply with an empty object to sendgrid.
    });

    app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
        const { title, subject, body, recipients } = req.body;

        const survey = new Survey({
            title,
            subject,
            body,
            //recipients: recipients.split(',').map( email => { return {email: email.trim()} })
            recipients: recipients.split(',').map( email => ({email: email.trim()}) ),    // same as above - ES6 syntax. Note () needed between emails to avoid confusing JS
            _user: req.user.id,
            dateSent: Date.now()
        });

        // Great place to send an email.

        try {
            const mailer = new Mailer(survey, surveyTemplate(survey));
            await mailer.send();
            await survey.save();
            req.user.credits -= 1;
            const user = await req.user.save();

            res.send(user);
        }
        catch (err) {
            res.status(422).send(err);
        }
        
    });
};