import React from "react";
import axios from "axios";
import Box from '@mui/material/Box';
import { useState } from "react"
import Navbar from "./navbar"
import Button from '@mui/material/Button';
import "./home.css"
const DropzoneAreaExample = () => {

    const [data, setData] = useState({});
    const [audio_src, setAudio] = useState();
    const [disease, setDisease] = useState({});
    const [resprate, setResprate] = useState({});
    const [classes, setClasses] =useState({});
    const [loading, setLoading] =useState(false);

    var onFileChange = event => {
        setData(event.target.files[0]);
        setAudio(URL.createObjectURL(event.target.files[0]));
        setClasses({});
        setDisease({});
        setResprate({});
        // const config = {
        //     headers: { 'content-type': 'multipart/form-data' }
        // }
        // let formData = new FormData();
        // formData.append(
        //     "myAudio",
        //     event.target.files[0]
        // )

        // axios.post('http://localhost:3001/uploadphoto', formData ,config)
        // .then(res => {
        //     console.log(res.data)
        // })
        // .catch(err => console.log(err));

    };


    const detect = () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("file", data);
        var config = {
            method: 'post',
            url: 'http://localhost:8000/object-to-json',
            // url: 'http://52.199.71.69:8000/object-to-json',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        };
        console.log("sending req...........");
        axios(config)
            .then(function (response) {
                var res = response.data;
                console.log(res);
                var disease={
                    "lstm_prediction" : res["disease_lstm"]["prediction"],
                    "lstm_confidence" : res["disease_lstm"]["confidence"],
                    "gru_prediction" : res["disease_gru"]["prediction"],
                    "gru_confidence" : res["disease_gru"]["confidence"]
                }
                var res_rate={
                    "lstm_prediction" : res["rr_lstm"]["prediction"],
                    "lstm_confidence" : res["rr_lstm"]["confidence"],
                    "gru_prediction" : res["rr_gru"]["prediction"],
                    "gru_confidence" : res["rr_gru"]["confidence"]
                }
                var confi_classes={
                    "disease_lstm" : "",
                    "rr_lstm" : "",
                    "disease_gru" : "",
                    "rr_gru" : ""
                }

                if(parseFloat(res["disease_lstm"]["confidence"])<=0.45)
                    confi_classes.disease_lstm="low";
                else if(parseFloat(res["disease_lstm"]["confidence"])<=0.75)
                    confi_classes.disease_lstm="mid";
                else
                    confi_classes.disease_lstm="high";

                if(parseFloat(res["disease_gru"]["confidence"])<=0.45)
                    confi_classes.disease_gru="low";
                else if(parseFloat(res["disease_gru"]["confidence"])<=0.75)
                    confi_classes.disease_gru="mid";
                else
                    confi_classes.disease_gru="high";

                if(parseFloat(res["rr_lstm"]["confidence"])<=0.45)
                    confi_classes.rr_lstm="low";
                else if(parseFloat(res["rr_lstm"]["confidence"])<=0.75)
                    confi_classes.rr_lstm="mid";
                else
                    confi_classes.rr_lstm="high";

                if(parseFloat(res["rr_gru"]["confidence"])<=0.45)
                    confi_classes.rr_gru="low";
                else if(parseFloat(res["rr_gru"]["confidence"])<=0.75)
                    confi_classes.rr_gru="mid";
                else
                    confi_classes.rr_gru="high";

                console.log(confi_classes)
                setLoading(false);
                setClasses(confi_classes);
                setDisease(disease);
                setResprate(res_rate);
            })
            .catch(function (error) {
                console.log(error);
            });
    };


    return (
        <div>
            <Navbar />
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="75vh"
            >
                <div>
                    <div className="input_area">
                    <fieldset>
                        <h2>Upload a .wav File !!!</h2>
                        <input type="file" onChange={onFileChange} />
                        <br /><br />
                        <Button variant="contained" color="primary" onClick={detect} >
                            Detect!
                        </Button>
                    </fieldset>
                    </div>
                    <br/><br/>
                    <div>
                        {audio_src && <audio src={audio_src} controls />}
                    </div>
                    <br /><br />
                    {loading && <h3>PROCESSING ....</h3>}
                    <br /><br />
                    <div className="result">
                    {Object.keys(disease)!=0 &&
                        <div className="input_area">
                        <fieldset>
                            <legend><strong>LSTM Predictions :</strong></legend>
                            <div>
                                <h2>Predicted disease : {disease.lstm_prediction}</h2>
                                <h3>Confidence : <div className={classes.disease_lstm}>{disease.lstm_confidence}</div></h3>
                                <h2>Respirotory Rate : {resprate.lstm_prediction}</h2>
                                <h3>Confidence : <div className={classes.rr_lstm}>{resprate.lstm_confidence}</div></h3>
                            </div>
                        </fieldset>
                        </div>
                    }
                    <br />
                    {Object.keys(disease)!=0  &&
                        <div className="input_area">
                        <fieldset>
                            <legend><strong>GRU Predictions :</strong></legend>
                            <div>
                                <h2>Predicted disease : {disease.gru_prediction}</h2>
                                <h3>Confidence : <div className={classes.disease_gru}>{disease.gru_confidence}</div></h3>
                                <h2>Respirotory Rate : {resprate.gru_prediction}</h2>
                                <h3>Confidence : <div className={classes.rr_gru}>{resprate.gru_confidence}</div></h3>
                            </div>
                        </fieldset>
                        </div>
                    }
                    </div>
                </div>
            </Box>
        </div>

    );
};

export default DropzoneAreaExample;