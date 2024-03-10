import React from "react";
   
class Books extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = {
            quote: "",
            actor: "",
            author:"",
            title: "",
            data: [],
            loading: true,
        };
    }
} 

export default Books;
