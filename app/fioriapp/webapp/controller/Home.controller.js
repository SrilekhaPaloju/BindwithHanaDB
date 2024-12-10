sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], (Controller,MessageBox,MessageToast) => {
    "use strict";

    return Controller.extend("com.app.fioriapp.controller.Home", {
        onInit() {
        },
        onAfterRendering: async function (evt) {
            var that = this;
            this.flag = 0;
            try {
                var that = this;
                var date = new Date();
                var startTime = date.getTime();
                this.appointmentURL = {
                    startTime: startTime,
                    channel: "ui5app",
                    token: "007eJxTYJi+YdVd1xke2j9ZjgUJBH2utVpyLeT2E4s+B3G3K9+tfQ4rMFimmlqkJhkbmiQmWZoYJiYmJRlZGCUbJ1oaGaQkW1oYGj4IS28IZGTwFHnLxMgAgSA+G0NppmliQQEDAwDGmCCJ"
                };
                this.timeOut = setInterval(function () {
                that.alertFunc()
                }.bind(that), 1000);
                that.rtc = {
                    // For the local audio and video tracks.
                    localAudioTrack: null,
                    localVideoTrack: null,
                };
                if (this.appointmentURL) {
                    var options = {
                        // Pass your app ID here.
                        appId: "9e58eb314ab941aabb282c3a920dc981",
                        // Set the channel name.
                        channel: this.appointmentURL.channel,
                        // Set the user role in the channel.
                        role: "host"
                    };
                    var token = this.appointmentURL.token;
                }
                that.client = AgoraRTC.createClient({
                    mode: "rtc",
                    codec: "vp8"
                });
                var uid = "doctor";
                var div = document.createElement("div");
                div.id = uid;
                div.className = "zoomOut"
                that.client.on("user-left", async(user, mediaType) => {
                    var elem = document.getElementById("id" + user.uid);
                    elem.parentElement.removeChild(elem);
                    console.log("left");
                });
                that.client.on("user-published", async(user, mediaType) => {
                    await that.client.subscribe(user, mediaType);
                    console.log("subscribe success");
                    var uuid = "id" + user.uid;
                    if (document.getElementById(uuid) == undefined) {
                        var div = document.createElement("div");
                        div.id = uuid;
                        if (that.flag === 0) {
                            div.className = "zoomIn"
                        } else {
                            div.className = "zoomOut"
                        }
                        that.buttonUID = uuid;
                        var button = document.createElement("button");
                        if (that.flag === 0) {
                            button.innerHTML = "Unpin";
                        } else {
                            button.innerHTML = "Pin";
                        }
                        button.className = "zoomButton";
                        that.flag = 1;
                        button.addEventListener("click", function (oEvent) {
                            var a = document.getElementById(uuid).className;
                            if (a == "zoomOut") {
                                if (document.getElementsByClassName("zoomIn").length > 0) {
                                    document.getElementsByClassName("zoomIn")[0].className = "zoomOut";
                                }
                                document.getElementById(uuid).className = "zoomIn";
                                oEvent.currentTarget.innerHTML = "Unpin";
                                var allButtons = document.getElementsByClassName("zoomOut");
                                for (var i = 1; i < allButtons.length; i++) {
                                    var reqButton = allButtons[i].getElementsByClassName("zoomButton");
                                    if (reqButton.length > 0) {
                                        reqButton[0].style.display = "none";
                                    }
                                }
                            } else {
                                document.getElementById(uuid).className = "zoomOut";
                                oEvent.currentTarget.innerHTML = "Pin";
                                var allButtons = document.getElementsByClassName("zoomOut");
                                for (var i = 1; i < allButtons.length; i++) {
                                    var reqButton = allButtons[i].getElementsByClassName("zoomButton");
                                    if (reqButton.length > 0) {
                                        reqButton[0].style.display = "block";
                                    }
                                }
                            }
                        });
                        div.appendChild(button);
                        document.getElementById("participant").appendChild(div);
                    }
                    const remoteVideoTrack = user.videoTrack;
                    that.remotePlayerContainer = document.getElementById(uuid);
                    remoteVideoTrack.play(that.remotePlayerContainer);
                    if (mediaType === "audio") {
                        const remoteAudioTrack = user.audioTrack;
                        remoteAudioTrack.play();
                    }
                });
                document.getElementById("participant").appendChild(div);
                // that.client.setClientRole(options.role);
                await that.client.join(options.appId, options.channel, token, 0);
                that.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
                that.rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
                await that.client.publish([that.rtc.localAudioTrack, that.rtc.localVideoTrack]);
                that.localPlayerContainer = document.getElementById(uid);
                that.rtc.localVideoTrack.play(that.localPlayerContainer);
                // Users joins for the first time
            } catch (error) {
                console.log(error);
                var errorMessage;
                // Handle Errors here.
                if (error && error.message) {
                    errorMessage = error.message;
                    if (error.code == 'CAN_NOT_GET_GATEWAY_SERVER') {
                        errorMessage = "The meeting session is no longer valid. Contact Admin";
                    }
                } else {
                    errorMessage = "Something went wrong, contact Admin if the error persists";
                }
                MessageBox.error(errorMessage, {
                    actions: [MessageBox.Action.CLOSE],
                    onClose: function (sAction) {
                        if (sAction == 'CLOSE') {
                            // Write close operation
                        }
                    }
                });
            };
        },
        onCancelCall: function (oEvent) {
            this.closeCall();
        },
        onMarkCompleteCall: function (oEvent) {
            this.closeCall();
        },
        closeCall: async function (oEvent) {
            var that = this;
            var date = new Date();
            var endTime = date.getTime();
            if (that.rtc) {
                that.rtc.localAudioTrack.close();
                // that.rtc.localVideoTrack.stop();
                that.rtc.localVideoTrack.close();
                // Traverse all remote users.
                // Destroy the dynamically created DIV containers.
                const playerContainer = document.getElementById('div2');
                playerContainer && playerContainer.remove();
                // Leave the channel.
                await that.client.leave();
            }
        },
        alertFunc: function () {
            var that = this;
            var countDownDate = that.appointmentURL.startTime;
            // Get today's date and time
            var now = new Date().getTime();
            var endTime = "10-22-05";
            // Find the distance between now and the count down date
            var distance = now - countDownDate;
            // Time calculations for days, hours, minutes and seconds
            var hours = that.doubleDigit(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
            var minutes = that.doubleDigit(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
            var seconds = that.doubleDigit(Math.floor((distance % (1000 * 60)) / 1000));
            var timeRemaining =
                new Date('01/01/2007 ' + endTime.split('-')[1] + ':00').getTime() -
                new Date('01/01/2007 ' + endTime.split('-')[0] + ':00').getTime();
            var diff = Math.abs(
                Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)),
            );
            that.getView().byId("idRemaining").setText(hours + ':' + minutes + ':' + seconds);
            if (minutes > diff) {
                that.getView().byId("idRemaining").setType("Critical");
            }
        },
        doubleDigit: function (time) {
            return ("0" + time).slice(-2);
        },
        onShareScreen: async function (oEvent) {
            var that = this;
            if (this.appointmentURL) {
                var appId = "09ed05f4f81d4ec580c45277ab70dac5";
                var channel = this.appointmentURL.channel;
                var token = this.appointmentURL.token;
            }
            const screenClient = AgoraRTC.createClient({
                mode: "rtc",
                codec: "vp8"
            });
            await screenClient.join(appId, channel, token);
            const screenTrack = await AgoraRTC.createScreenVideoTrack();
            await screenClient.publish(screenTrack);
            return screenClient;
        },
        onPressMute: function (oEvent) {
            this.byId("idMute").setVisible(false);
            this.byId("idUnmute").setVisible(true);
            this.rtc.localAudioTrack.setEnabled(false);
        },
        onPressUnmute: function (oEvent) {
            this.byId("idMute").setVisible(true);
            this.byId("idUnmute").setVisible(false);
            this.rtc.localAudioTrack.setEnabled(true);
        },
        onPressZoomIn: function (oEvent) {
            var divID = oEvent.getSource().data("divID");
            document.getElementById(divID).style.width = "640px";
            document.getElementById(divID).style.height = "480px";
        },
        onPressZoomOut: function (oEvent) {
            var divID = oEvent.getSource().data("divID");
            document.getElementById(divID).style.width = "320px";
            document.getElementById(divID).style.height = "240px";
        }
    });
});