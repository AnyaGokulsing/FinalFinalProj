import React, {Fragment, useState} from "react";

const Bookings = () => {
    return (
    <Fragment>
        <h4>in progress</h4>
        <div class="col-sm-4">
        <form class="d-flex mt-5" >
        <label for="birthdaytime">Availability&nbsp;&nbsp;&nbsp;</label>
        <div class="lg-16">
          <input
            type="datepicker"
            class="form-control"
            id="birthdaytime"
            name="birthdaytime"
          />
        </div>
        <button type="submit" class="btn btn-primary ml-6">
          Submit
        </button>
      </form>
        </div>
    </Fragment>);
};

export default Bookings;