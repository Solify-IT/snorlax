import React from 'react';
import axios from "axios";


const url = "https://openlibrary.org/books/OL7353617M.json";
//const url = "file:///Users/kevinw/Documents/GitHub/snorlax/frontend/src/views/App/local/books.json";

type MyProps = {
    // using `interface` is also ok
    message: string;
  };
  type MyState = {
    data: [] ;// like this
  };
 

class Local extends React.Component {
    state: MyState = {
        data:[]
      };

    peticionGet =()=>{
       axios.get(url).then(response=>{
           console.log(response.data);
           this.setState({data:response.data});
       });
    }

    componentDidMount(){
        this.peticionGet();
    }

    data = Array.from(props.data);

    




    render(){
    return (
        <div className="Local">
            <input placeholder= "Buscar libro por isbn..." ></input>
            <button>Buscar</button>
            <br /><br /><br />
                    <table className="table ">
                    <thead>
                        <tr>
                        <th>Nombre</th>
                        <th>Publicador</th>
                        <th>Páginas</th>
                        <th>isbn</th>
                        <th>Cover</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map(
                            libro=>{
                                return(
                                    <tr>
                                        <td>libro.ocaid</td>
                                        <td>libro.title</td>
                                        <td>libro.key</td>
                                        <td>libro.publish_date</td>
                                    </tr>
                                )
                            }
                        )}
                    </tbody>
                    </table>
        </div>
    );
    }
}

export default Local;
