var setup = require('../setup.js');
var waitlist = require('../globalWaitlist.js')(setup);

module.exports = function(payloadContent, cb) {

var inactive = "";
if (payloadContent.fleets.length === 0) {
  inactive = `<div role="alert" class="alert alert-primary global-banner-inactive noselect">
            <strong>Waitlist Inactive:</strong> There is either no fleets, or the waitlist is not being used. Check our in-game channel for more information!
          </div>`
}


var fleets = "";
  for (var i = 0; i < payloadContent.fleets.length; i++) {
    fleets += `
              <div class="col-lg-6 col-md-12"> 
                <div class="statistic-block block">
                  <div class="title">
                    <strong>Fleet Info</strong>
                  </div>
                  <table class="table table-striped table-sm noselect">
                    <tbody>
                      <tr>
                        <td  class="tw60per">Fleet Commander:</td>
                        <td><a href="#">${payloadContent.fleets[i].fc.name}</a></td>
                      </tr>
                      <tr>
                        <td>Secondary Fleet Commander:</td>
                        <td><a href="#">${payloadContent.fleets[i].backseat.name || "None"}</a></td>
                      </tr>
                      <tr>
                        <td>Fleet Type:</td>
                        <td>${payloadContent.fleets[i].type}</td>
                      </tr>
                      <tr>
                        <td>Fleet Doctrine:</td>
                        <td>{MainFleet/ArseFleet}</td>
                      </tr>                      
                      <tr>
                        <td>Fleet Status:</td>
                        <td>${payloadContent.fleets[i].status}</td>
                      </tr>
                      <tr>
                        <td>Fleet Size:</td>
                        <td>${payloadContent.fleets[i].members.length}</td>
                      </tr>                      
                      <tr>
                        <td>Fleet Location:</td>
                        <td><a href="#">${payloadContent.fleets[i].location}</a></td>
                      </tr>
                      <tr>
                        <td>Fleet Comms:</td>
                        <td><a href="${payloadContent.fleets[i].comms.url}">${payloadContent.fleets[i].comms.name}</a></td>
                      </tr>
                    </tbody>
                  </table>
                </div> 
              </div>          
    `
  }
  
waitlist.getUserPosition(payloadContent.user.characterID, function(position, found, name) {
  waitlist.getCharsOnWaitlist(payloadContent.user.characterID, function(charList) {
    //If they have a char in the waitlist AND they have no related chars, hide the "Join Waitlist" button
    var joinWaitlist = `<button class="btn btn-success btn-block" type="submit"><i class="fa fa-check"></i> Join the Waitlist</button>`;
    var leaveWaitlist = `<a href="/remove"><i class="fas fa-exclamation-triangle"></i> Leave the Waitlist</a>`;
    /*if (found && payloadContent.user.relatedChars.length === 0) {
      joinWaitlist = "";
    }
    //If they have no char in the waitlist, hide the leave waitlist button
    if (!found) {
      leaveWaitlist = "";
    }*/
    var usernames = `<option value="${payloadContent.user.name}" selected>${payloadContent.user.name}</option>`;
    //If the user's main character is already in the waitlist, hide them from the list
    if (name == payloadContent.user.name) {
      usernames = "";
    }
    
    for (var i = 0; i < payloadContent.user.relatedChars.length; i++) {
      usernames += `<option value="${payloadContent.user.relatedChars[i].name}" selected>${payloadContent.user.relatedChars[i].name}</option>`;
    }

    var queueinfo = "";
    if(position.position !== '##'){
      queueinfo += `
                    <!-- Waitlist Queue Panel -->
                    <div class="statistic-block block noselect">
                      <div class="title">                    
                        <strong>Queue Info</strong>
                      </div>
                      <!-- Your Position Table -->
                      <table class="table table-striped table-sm noselect">
                        <tbody>
                          <tr>
                            <td class="tw60per">Your Position:</td>
                            <td>${position.position || "##"} out of ${position.length || "##"}</td>
                          </tr>
                          <!--<tr>
                            <td>FC sees you as: <div class="d-inline" data-toggle="tooltip" data-placement="top" title="The FC sees you as your first pilot on the waitlist."><i class="fas fa-question-circle"></i></div></td>
                            <td>{Todo}</td>
                          </tr>-->                      
                          <tr>
                            <td>Chars on Waitlist:</td>
                            <td>${charList.join(", ")}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>`
    }

    var waitlistup = "";
    if(payloadContent.fleets.length > 0){
      waitlistup += `
                    <div class="statistic-block block">
                      <!-- Select Character -->
                      <form method="POST" action="/" role="form">
                        <div class="form-group">
                          <label for="character">Select Pilot:</label>
                          <!-- 
                          <select name="user" class="form-control" id="character">
                            <option value="">Choose</option>
                            <option value="${payloadContent.user.name}" selected>${payloadContent.user.name}</option>
                            <option value="2">Samuel the Terrible</option>
                            <option value="3">Samuel the Merciless</option>
                          </select>
                          -->
                          <input type="text" name="name" class="form-control" id="character" value="${payloadContent.user.name}">
                        </div>
                        
                        <!-- Yes/No Options -->
                        <ul class="list-unstyled">
                          <!--<li>
                            <label for="translator">Do you require a translator?</label>
                            <div class="form-check">
                              <label class="form-check-label">
                              <input class="form-check-input" type="radio" id="translator" name="translator" value="true" required/> Yes
                              </label>
                              <label class="form-check-label">
                              <input class="form-check-input" type="radio" name="translator" value="false"/> No
                              </label>
                            </div>
                          </li>-->                          
                        </ul>
                        <!-- Select Fits -->
                        <div id="fits">
                          <strong><div class="d-inline" data-toggle="tooltip" data-placement="top" title="This is a temporary system, type your ship type (Example: NYX)" required><i class="fa fa-info-circle"></i></div> Select your fits </strong>
                          <!--<ul class="list-unstyled">
                            <li>
                              <label for="ingame">Are you in our in-game channel? (imperium.incursions)</label>
                              <div class="form-check">
                                <label class="form-check-label">
                                <input class="form-check-input" type="radio" id="ingame" name="ingame" value="true" required/> Yes
                                </label>
                                <label class="form-check-label">
                                <input class="form-check-input" type="radio" value="false" name="ingame"/> No
                                </label>
                              </div>
                            </li>
                            <li>
                              <label for="coms">Are you on comms?</label>
                              <div class="form-check">
                                <label class="form-check-label">
                                <input class="form-check-input" type="radio" id="comms" name="oncomms" value="true" required/> Yes
                                </label>
                                <label class="form-check-label">
                                <input class="form-check-input" type="radio" value="false" name="oncomms"/> No
                                </label>
                              </div>
                            </li>
                          </ul>
                          <!-- Select Fits -->
                          <div id="fits">
                            <!--<ul class="list-unstyled">
                              <li>
                                <button class="btn btn-sm btn-block fit" type="button">a</button>
                                <button class="btn btn-sm btn-block fit" type="button">b</button>
                                <button class="btn btn-sm btn-block fit" type="button">c</button>
                                <button class="btn btn-sm btn-block fit" type="button">d</button>
                              </li>
                            </ul>-->
                            <div class="form-group">
                              <label for="ship">Ship Type: </labl>
                              <input type="text" name="ship" class="form-control" id="ship">
                            </div>
                          </div>
                          <!-- Action Buttons -->
                          <span class="font-italic mb-2"><i class="fas fa-exclamation-triangle"></i> Please pay attention to our in game channel 'imperium.incursions' and be on mumble while you wait for an invite to fleet!</span>
                          ${joinWaitlist}
                        </form>
                        <div class="row">
                          <div class="col-xl-12 col-lg-12 col-sm-12">
                            ${leaveWaitlist}
                          </div>
                          
                          <hr/>
                          
                          <!-- Alt Waitlist Up -->
                          <!-- Hidden for Now
                          <div class="col-xl-12 col-lg-12 col-sm-12" style="margin-top:10px">
                            <strong>Join the Waitlist</strong>                      
                              <table class="table table-responsive table-sm">
                                <tbody>
                                  <tr style="height:33px;">
                                    <td><a href="#">MyAltOne</a></td>
                                    <td>
                                      <select name="ship" class="form-control" id="ship" style="height: 30px;line-height: 1px;font font-size:;font-size: 10px;">
                                        <option value="">Choose</option>
                                      </select>                              
                                    </td>
                                    <td><button class="btn btn-sm btn-success"><i class="fas fa-plus"></i></button></td>
                                  </tr>
                                  <tr style="height:33px;">
                                    <td><a href="#">MyAltTwo</a></td>
                                    <td>
                                      <select name="ship" class="form-control" id="ship" style="height: 30px;line-height: 1px;font font-size:;font-size: 10px;">
                                        <option value="">Choose</option>
                                      </select>                              
                                    </td>                              
                                    <td><button class="btn btn-sm btn-danger"><i class="fas fa-minus"></i></button></td>
                                  </tr>
                                </tbody>
                              </table>                      
                            <button class="btn btn-sm btn-success float-right">Add all alts</button>
                            <button class="btn btn-sm btn-danger float-right">Remove all alts</button> 
                          </div>
                          -->
                          <!-- End Alt Waitlist Up -->                    
                        </div>
                      </div>
                    </div>`
    }
    

        cb(`
        <!-- Page Content -->
        <div class="page-content">
          <div class="page-header noselect">
            <div class="container-fluid">
              <h2 class="h5 no-margin-bottom"><strong class="text-primary">THE</strong><strong>WAITLIST</strong></h2>
            </div>
          </div>
          <!-- Banner Message -->
          <section>
            <!-- No Fleet -->
            <div id="alertarea">
            ${inactive}
            </div>
          </section>
          <!-- Main Content -->
          <section class="no-padding-top padding-bottom noselect">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-4 col-md-6 col-sm-12">
                  ${queueinfo}
                  ${waitlistup}
                </div>
                <!-- End Waitlist Panel -->
                
                <!-- Fleet Info -->
                <div class="col-lg-8 col-md-6 col-sm-12">
                  <div class="row">
                    <!-- Fleet Info Table -->		  
                    ${fleets}
                  </div>
                </div>
                <!-- End Fleet Info -->
                
              </div>
            </div> 
          </section>
          <script>
            function getParameterByName(name, url) {
              if (!url) url = window.location.href;
              name = name.replace(/[\\[\\]]/g, "\\\\$&");
              var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                  results = regex.exec(url);
              if (!results) return null;
              if (!results[2]) return '';
              return decodeURIComponent(results[2].replace(/\\+/g, " "));
            }

            var doc = document.getElementById("alertarea");

            var errtext = getParameterByName("err");
            var infotext = getParameterByName("info");
            if (errtext) {
              doc.innerHTML += \`<div role="alert" class="alert alert-primary global-banner-inactive">
                <strong>Error:</strong> \$\{errtext\}
              </div>\`;
            }
            if (!infotext) {
              infotext = 'This waitlist is in heavy, heavy alpha. Most things do not work, wording will be incorrect and things will break. Click <a href="https://github.com/Makeshift/eve-goons-waitlist/issues/new">HERE</a> to submit a bug report.';
            }
            doc.innerHTML += \`<div role="alert" class="alert alert-dark global-banner">
              <strong>INFO: \$\{infotext\}</strong> 
            </div>\`;

          </script>
          `);
    })
  });
}