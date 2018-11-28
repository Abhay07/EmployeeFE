import React from "react";
import ReactDOM from "react-dom";
import styles from './style.css';
import axios from 'axios';

class Header extends React.Component{
	render(){
		return (
			<div className={styles.header}>
				Employees List
			</div>
		);
	}
}

const callUpdateService = (param)=>{
	axios({
		method:'post',
		url:'http://ec2-18-188-219-160.us-east-2.compute.amazonaws.com:8080/api/employees',
		data:param,
		headers:{'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZmQ4ZmRjYjQ5NTMxMDdjMmYyM2VmOCIsImlhdCI6MTU0MzM0NDA5MiwiZXhwIjoxNTQzNDMwNDkxfQ.ySNaMoKMzf5QEUA-t3VonuMjbLvl_nENYWpbek3ceiU'}
	},param)
	.then((res)=>{
		console.log('Succesful Updation')
	})
	.catch(()=>{

	})
}

class List extends React.Component{
	constructor(props){
		super(props);
		this.state = {list:[]};
		this.nameClicked = this.nameClicked.bind(this);
		this.surnameClicked = this.surnameClicked.bind(this);
		this.addEmployee = this.addEmployee.bind(this);
		this.saveDetails = this.saveDetails.bind(this);
	}

	nameClicked(i){
		const list = this.state.list;
		list[i].name.editable = true;
		this.setState({list:list});
	}

	surnameClicked(i){
		const list = this.state.list;
		list[i].surName.editable = true;
		this.setState({list:list});
	}

	updateName(index, firstName){
		const list = this.state.list;
		list[index].name.value = firstName;
		this.setState({list:list});
	}

	updateSurname(index, lastName){
		const list = this.state.list;
		list[index].surName.value = lastName;
		this.setState({list:list});
	}

	saveDetails(index, id,firstName,lastName){
		const list = this.state.list;
		list[index].name.editable = false;
		list[index].surName.editable = false;
		this.setState({list:list});
		const param = {};
		param.Name = firstName;
		param.Surname = lastName;
		if(id){
			param.Id = id;
		}
		callUpdateService(param);
	}

	addEmployee(){
		const list = this.state.list;
		list.push({
				name:{
					value :'',
					editable:true
				},
				surName:{
					value:'',
					editable:true
				}
			})
		this.setState({list:list});
	}

	componentDidMount(){
		axios.get('http://ec2-18-188-219-160.us-east-2.compute.amazonaws.com:8080/api/employees')
		.then((res)=>{
			const data = res.data;
			const parsedData = data.map((el)=>{
				return {
					name:{
						value :el.Name,
						editable:false
					},
					surName:{
						value:el.Surname,
						editable:false
					},
					id:el._id
				}
			})
			this.setState({list:parsedData});
		})
		.catch(()=>{

		})
	}

	render(){
		const list = this.state.list;
		console.log(typeof(list));
		let listElem = list.map((val,index) => 
					
					 <div className={styles.listWrapper} key={index} > 
						<div className={styles.name}>
							<b>Name:</b> 
							
							{	
								val.name.editable ? 
								<input type="text"  onBlur={(e)=> this.updateName(index, e.target.value)}/>
								:
								<span onClick={(e) =>this.nameClicked(index)} > { val.name.value } </span>
							}
						</div>
						<div className={styles.surname}>
							<b>Surname:</b> 
							{	
								val.surName.editable ?  
								<input type="text" onBlur={(e)=> this.updateSurname(index, e.target.value)}/> 
								:
								<span onClick={(e) =>this.surnameClicked(index)} > { val.surName.value } </span>
							}
						</div>
						{
							(val.surName.editable || val.name.editable) &&
							<button className={styles.doneBtn} onClick={(e)=>this.saveDetails(index,val.id,val.name.value,val.surName.value)}>Save</button>
						}
					 </div>
					
					 
					
		);

		return (
			<div className={styles.listContainer}>
				<div className={styles.btnContainer}>
					<button className={styles.addButton} onClick={this.addEmployee}>Add Employee</button>
				</div>
				{listElem}	
			</div>
		);
	}
}

class App extends React.Component {
  render() {
    return (
    <div>
	    <Header />
	    <List />
    </div>
    );
  }
}


ReactDOM.render(
<App />,
document.getElementById('root')
);
