import React, { FC, useState, useEffect } from 'react';
import type { NextPage } from 'next';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/bootstrap/forms/Input';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import FoodAddModal from '../../../components/custom/FoodAddModal';
import {
	addDoc,
	collection,
	CollectionReference,
	doc,
	DocumentData,
	getDocs,
	updateDoc,
} from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import Select from '../../../components/bootstrap/forms/Select';
import Option from '../../../components/bootstrap/Option';
const Index: NextPage = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [addModalStatus, setAddModalStatus] = useState<boolean>(false);
	const [foodData, setFood] = useState<any[]>([]);

	//get all project
	useEffect(() => {
		const fetchData = async () => {
			try {
				const dataCollection = collection(firestore, 'order');
				const querySnapshot = await getDocs(dataCollection);
				const firebaseData = querySnapshot.docs.map((doc) => {
					const data = doc.data();
					return {
						...data,
						cid: doc.id,
					};
				});
				setFood(firebaseData);
				console.log(firebaseData);
			} catch (error) {
				console.error('Error fetching data: ', error);
			}
		};

		fetchData();
	}, []);

	const handlesubmit = (data: any) => {
		const docRef = doc(firestore, 'order', data.cid);
		// Update the data

		updateDoc(docRef, data)
			.then(() => {})
			.catch((error) => {
				console.error('Error adding document: ', error);
				alert('An error occurred while adding the document. Please try again later.');
			});
	};
	return (
		<PageWrapper>
			<SubHeader>
				<SubHeaderLeft>
					<label
						className='border-0 bg-transparent cursor-pointer me-0'
						htmlFor='searchInput'>
						<Icon icon='Search' size='2x' color='primary' />
					</label>
					<Input
						id='searchInput'
						type='search'
						className='border-0 shadow-none bg-transparent'
						placeholder='Search Food Item...'
						// onChange={formik.handleChange}
						onChange={(event: any) => {
							setSearchTerm(event.target.value);
						}}
						value={searchTerm}
					/>
				</SubHeaderLeft>
				<SubHeaderRight>
					<SubheaderSeparator />
					{/* Button to open new employee modal */}
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						{/* Table for displaying customer data */}
						<Card stretch>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-hover table-bordered border-primary'>
									<thead className={'table-dark border-primary text-center'}>
										<tr>
											<th>Table No</th>
											<th>order</th>
											<th>Status</th>
											<th>Change Status</th>
										</tr>
									</thead>
									<tbody className='text-center'>
										{foodData
										.filter((val) => {
											if (searchTerm === '') {
												return val;
											} else if (
												val.table.toLowerCase().includes(searchTerm.toLowerCase())
											) {
												return val;
											}
										})
                                        .map((employee, index) => (
											 <tr
											 key={index}
											 className={
												 employee.status === 'Serve'
													 ? 'bg-success-subtle text-dark'
													 : employee.status === 'Pending to Prepare'
													 ? 'bg-warning-subtle text-dark'
													 
													 : employee.status === 'Ready to Serve'
													 ? 'bg-danger-subtle'
													 : ''
											 }
										 >
												<td>{employee.table}</td>
												<td>
													<table className='table table-modern table-hover'>
														<tbody className='text-start'>
															{employee.foodData
																
																.map((data: any, i: number) => (
																	<tr key={i}>
																		<td className='w-50'>
																			{data.name}
																		</td>
																		<td>{data.points}</td>
																	</tr>
																))}
														</tbody>
													</table>
												</td>
												<td>{employee.status}</td>
												<td>
													<td>
														<Select
															ariaLabel='Default select example'
															placeholder='change status'
															className='col-6'
															value={employee.status}
															onChange={(e: any) => {
																const updatedRows = [...foodData];
																updatedRows[index].status =
																	e.target.value;
																setFood(updatedRows);
																handlesubmit(foodData[index]);
															}}>
															<Option value='Pending to Prepare'>
																Pending to Prepare
															</Option>
															<Option value='preparing'>
																preparing
															</Option>
															<Option value='Ready to Serve'>
																Ready to Serve
															</Option>
															{/* <Option value='One Day'>Serve</Option> */}
														</Select>
													</td>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
			<FoodAddModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id='' />
		</PageWrapper>
	);
};

export default Index;
