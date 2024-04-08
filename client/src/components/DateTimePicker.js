import React, { Fragment, useState } from "react";
const DateTimePicker = () => {
  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = {};
    } catch (err) {
      console.error(err.message);
    }
  };
  return (
    <Fragment>
      <form class="d-flex mt-5" onSubmit={onSubmitForm}>
        <label for="birthdaytime">Availability&nbsp;&nbsp;&nbsp;</label>
        <div class="lg-16">
          <input
            type="datetime-local"
            class="form-control"
            id="birthdaytime"
            name="birthdaytime"
          />
        </div>
        <button type="submit" class="btn btn-primary ml-6">
          Submit
        </button>
      </form>
    </Fragment>
  );
};
export default DateTimePicker;
