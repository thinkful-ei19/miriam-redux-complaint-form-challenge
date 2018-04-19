import React from 'react';
import { reduxForm, Field, SubmissionError, focus } from 'redux-form';
import Input from './input';
import { required, nonEmpty, email } from '../validators';

export class ContactForm extends React.Component {
    onSubmit(values) {
        return fetch('/api/messages', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) {
                    if (
                        res.headers.has('content-type') &&
                        res.headers
                            .get('content-type')
                            .startsWith('application/json')
                    ) {
                        // It's a nice JSON error returned by us, so decode it
                        return res.json().then(err => Promise.reject(err));
                    }
                    // It's a less informative error returned by express
                    return Promise.reject({
                        code: res.status,
                        message: res.statusText
                    });
                }
                return;
            })
            .then(() => console.log('Submitted with values', values))
            .catch(err => {
                const { reason, message, location } = err;
                if (reason === 'ValidationError') {
                    // Convert ValidationErrors into SubmissionErrors for Redux Form
                    return Promise.reject(
                        new SubmissionError({
                            [location]: message
                        })
                    );
                }
                return Promise.reject(
                    new SubmissionError({
                        _error: 'Error submitting message'
                    })
                );
            });
    }

    render() {
        let successMessage;
        if (this.props.submitSucceeded) {
            successMessage = (
                <div className="message message-success">
                    Message submitted successfully
                </div>
            );
        }

        let errorMessage;
        if (this.props.error) {
            errorMessage = (
                <div className="message message-error">{this.props.error}</div>
            );
        }

        return (
            <div className="complaintForm">
                <header className="App-header">
                <h2>
                Report a Delivery Problem
                </h2>
                </header>
                <form
                    onSubmit={this.props.handleSubmit(values =>
                        this.onSubmit(values)
                    )}>
                    {successMessage}
                    {errorMessage}
                    <Field
                        name="tracking-number"
                        type="text"
                        component={Input}
                        label="Tracking number"
                        validate={[required, nonEmpty]}
                    />
                    {/* <Field
                        name="email"
                        type="email"
                        component={Input}
                        label="What is your issue?"
                        validate={[required, nonEmpty, email]}
                    /> */}

                    <label for="issue">What is you issue?</label>
                    <select name="issue" id="issue">
                        <option value="not-delivered">My delivery hasn't arrived</option>
                        <option value="missing-part">Part of my order was missing</option>
                        <option value="wrong-item">The wrong item was delivered</option>
                        <option value="damaged">Some of my order arrived damaged</option>
                        <option value="other">Other (give details below)</option>
                        </select>
                
                    <Field
                        name="details"
                        element="textarea"
                        component={Input}
                        label="Give more details (optional)"
                        validate={[required, nonEmpty]}
                    />
                    {/* <Field
                        name="magicWord"
                        type="text"
                        component={Input}
                        label="What's the magic word?"
                        validate={[required, nonEmpty]}
                    />
                    <button
                        type="submit"
                        disabled={this.props.pristine || this.props.submitting}>
                        Send message
                    </button> */}
                </form>
            </div>
        );
    }
}

export default reduxForm({
    form: 'contact',
    onSubmitFail: (errors, dispatch) =>
        dispatch(focus('contact', Object.keys(errors)[0]))
})(ContactForm);
