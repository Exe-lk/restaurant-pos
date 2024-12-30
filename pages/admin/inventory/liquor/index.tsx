import React, { FC, useState, useEffect } from 'react';
import type { NextPage } from 'next';
import useDarkMode from '../../../../hooks/useDarkMode';
import PaginationButtons, {
	dataPagination,
	PER_COUNT,
} from '../../../../components/PaginationButtons';
import useSortableData from '../../../../hooks/useSortableData';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../../layout/SubHeader/SubHeader';
import Icon from '../../../../components/icon/Icon';
import Input from '../../../../components/bootstrap/forms/Input';
import Button from '../../../../components/bootstrap/Button';
import Page from '../../../../layout/Page/Page';
import Card, { CardBody } from '../../../../components/bootstrap/Card';
import moment from 'moment';
import { getColorNameWithIndex } from '../../../../common/data/enumColors';
import { getFirstLetter } from '../../../../helpers/helpers';
import Swal from 'sweetalert2';
import axios from 'axios';
import FoodAddModal from '../../../../components/custom/LiquorAddmodal';
import LiquorEditModal from '../../../../components/custom/LiquorEditModal';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { firestore } from '../../../../firebaseConfig';

const Index: NextPage = () => {
	// Dark mode
	const { darkModeStatus } = useDarkMode();
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [fulltime, setFulltime] = useState<boolean>(true);
	const [parttime, setParttime] = useState<boolean>(true);
	const [id, setId] = useState<any>();
	const [addModalStatus, setAddModalStatus] = useState<boolean>(false);
	const [status, setStatus] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['5']);
	const [foodData, setFood] = useState<any[]>([]);

	//get all project
	useEffect(() => {
		const fetchData = async () => {
			try {
				const dataCollection = collection(firestore, 'liquor');
				const querySnapshot = await getDocs(dataCollection);
				const firebaseData = querySnapshot.docs.map((doc) => {
					const data = doc.data();
					return {
						...data,
						id: doc.id,
					};
				});
				setFood(firebaseData);
			} catch (error) {
				console.error('Error fetching data: ', error);
			}
		};

		fetchData();
	}, [addModalStatus, editModalStatus]);

	const { items, requestSort, getClassNamesFor } = useSortableData(foodData);

	useEffect(() => {
		setId(foodData.length + 1);
	}, [foodData]);

	const handleClickDelete = async (id: string) => {
		try {
			const result = await Swal.fire({
				title: 'Are you sure?',
				text: 'You will not be able to recover this employee!',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, delete it!',
			});

			if (result.isConfirmed) {
				const docRef = doc(firestore, 'liquor', id);
				await deleteDoc(docRef);
				Swal.fire('Deleted!', 'Employee has been deleted.', 'success');
				const dataCollection = collection(firestore, 'liquor');
				const querySnapshot = await getDocs(dataCollection);
				const firebaseData = querySnapshot.docs.map((doc) => {
					const data = doc.data();
					return {
						...data,
						id: doc.id,
					};
				});
				setFood(firebaseData);
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			Swal.fire('Error', 'Failed to delete employee.', 'error');
		}
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
					<Button
						icon='PersonAdd'
						color='primary'
						isLight
						onClick={() => setAddModalStatus(true)}>
						New Bevergaes
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						{/* Table for displaying customer data */}
						<Card stretch>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-modern table-hover'>
									<thead>
										<tr>
											<th>Bevergaes Name</th>
											<th>Category</th>
											<th>Price</th>
											<th> volume</th>
											<th></th>
											<td />
										</tr>
									</thead>
									<tbody>
										{dataPagination(foodData, currentPage, perPage)
											.filter((val) => {
												if (searchTerm === '') {
													return val;
												} else if (
													val.name
														.toLowerCase()
														.includes(searchTerm.toLowerCase())
												) {
													return val;
												}
											})
											.map((employee, index) => (
												<tr key={employee.id}>
													<td>
														<div className='d-flex align-items-center'>
															<div className='flex-shrink-0'>
																<div
																	className='ratio ratio-1x1 me-3'
																	style={{ width: 48 }}>
																	{employee.imageurl ? (
																		<img
																			src={employee.imageurl}
																			className='mx-auto d-block mb-4'
																			alt='Selected Profile Picture'
																			style={{
																				width: '50px',
																				height: '50px',
																			}}
																		/>
																	) : (
																		<div
																			className={`bg-l${
																				darkModeStatus
																					? 'o25'
																					: '25'
																			}-${getColorNameWithIndex(
																				Number(
																					employee.NIC,
																				),
																			)} text-${getColorNameWithIndex(
																				index,
																			)} rounded-2 d-flex align-items-center justify-content-center`}>
																			<span className='fw-bold'>
																				{getFirstLetter(
																					employee.name,
																				)}
																			</span>
																		</div>
																	)}
																</div>
															</div>
															<div className='flex-grow-1'>
																<div className='fs-6 fw-bold'>
																	{employee.name}
																</div>
															</div>
														</div>
													</td>
													<td>{employee.category}</td>
													<td>Rs {employee.price}.00</td>
													<td>{employee.volume}</td>
													<td>
														<Button
															icon='Edit'
															color='primary'
															onClick={() => (
																setEditModalStatus(true),
																setId(employee.id)
															)}>
															Edit
														</Button>
														<Button
															className='m-2'
															icon='Delete'
															color='danger'
															onClick={() =>
																handleClickDelete(employee.id)
															}>
															Delete
														</Button>
													</td>
												</tr>
											))}
									</tbody>
								</table>
							</CardBody>
							<PaginationButtons
								data={items}
								label='items'
								setCurrentPage={setCurrentPage}
								currentPage={currentPage}
								perPage={perPage}
								setPerPage={setPerPage}
							/>
						</Card>
					</div>
				</div>
			</Page>
			<FoodAddModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id='' />
			<LiquorEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id={id} />
		</PageWrapper>
	);
};

export default Index;
