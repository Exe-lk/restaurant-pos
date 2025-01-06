import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
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
import Card, { CardBody, CardTitle } from '../../../../components/bootstrap/Card';
import UserAddModal from '../../../../components/custom/IngredientAddModal';
import UserEditModal from '../../../../components/custom/IngredientEditModal';
import UserStockAddModal from '../../../../components/custom/StockAddmodal';
import UserStockOutModal from '../../../../components/custom/StockOutModal';
import Swal from 'sweetalert2';

import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { firestore } from '../../../../firebaseConfig';
import { dataPagination, PER_COUNT } from '../../../../components/PaginationButtons';

const Index: NextPage = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [addModalStatus, setAddModalStatus] = useState<boolean>(false);
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false);
	const [stockAddModalStatus, setStockAddModalStatus] = useState<boolean>(false);
	const [stockOutModalStatus, setStockOutModalStatus] = useState<boolean>(false);
	const [deleteModalStatus, setDeleteModalStatus] = useState<boolean>(false);
	const [id, setId] = useState<string>('');
	const [ingredient, setIngredient] = useState<any[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [perPage, setPerPage] = useState<number>(PER_COUNT['50']);


	useEffect(() => {
		const fetchData = async () => {
			try {
				const dataCollection = collection(firestore, 'ingredient');
				const querySnapshot = await getDocs(dataCollection);
				const firebaseData = querySnapshot.docs.map((doc) => {
					const data = doc.data();
					return {
						...data,
						id: doc.id,
					};
				});
				setIngredient(firebaseData);
			} catch (error) {
				console.error('Error fetching data: ', error);
			}
		};

		fetchData();
	}, [addModalStatus, editModalStatus,stockAddModalStatus,stockOutModalStatus]);

	const handleClickDelete = async (id: string) => {
		console.log(id);
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
				const docRef = doc(firestore, 'ingredient', id);
				await deleteDoc(docRef);
				Swal.fire('Deleted!', 'Employee has been deleted.', 'success');
				const dataCollection = collection(firestore, 'ingredient');
				const querySnapshot = await getDocs(dataCollection);
				const firebaseData = querySnapshot.docs.map((doc) => {
					const data = doc.data();
					return {
						...data,
						id: doc.id,
					};
				});
				setIngredient(firebaseData);
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
						placeholder='Search...'
						onChange={(event: any) => {
							setSearchTerm(event.target.value);
						}}
						value={searchTerm}
					/>
				</SubHeaderLeft>
				<SubHeaderRight>
					<SubheaderSeparator />
					<Button
						icon='PersonAdd'
						color='success'
						isLight
						onClick={() => setAddModalStatus(true)}>
						New Ingredient
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						<Card stretch>
							<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-info'>
									Ingredient Management
								</div>
							</CardTitle>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-hover table-bordered border-primary'>
									<thead className={'table-dark border-primary'}>
										<tr>
											<th>Ingredient Name</th>
											<th>Category</th>
											<th>Quantity</th>
											
											<th></th>
										</tr>
									</thead>
									<tbody>
										{ingredient &&
											dataPagination(ingredient, currentPage, perPage)
												.filter((dealer: any) =>
													searchTerm
														? dealer.name
																.toLowerCase()
																.includes(searchTerm.toLowerCase())
														: true,
												)
												.map((dealer: any, index: any) => (
													<tr key={index}>
														<td>{dealer.name}</td>
														<td>{dealer.category}</td>
														<td>{dealer.quantity}</td>

														<td>
															<Button
																icon='CallReceived'
																tag='a'
																color='success'
																onClick={() => (
																	setStockAddModalStatus(true),
																	setId(dealer.id)
																)}>
																Stock In
															</Button>

															<Button
																className='m-2'
																icon='CallMissedOutgoing'
																tag='a'
																color='warning'
																onClick={() => (
																	setStockOutModalStatus(true),
																	setId(dealer.id)
																)}>
																Stock Out
															</Button>

															<Button
																icon='Edit'
																color='primary'
																onClick={() => (
																	setEditModalStatus(true),
																	setId(dealer.id)
																)}>
																Edit
															</Button>
															<Button
																className='m-2'
																icon='Delete'
																color='danger'
																onClick={() =>
																	handleClickDelete(dealer.id)
																}>
																Delete
															</Button>
														</td>
													</tr>
												))}
									</tbody>
								</table>
								<Button
									icon='Delete'
									className='mb-5'
									onClick={() => setDeleteModalStatus(true)}>
									Recycle Bin
								</Button>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
			<UserAddModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id='' />
			<UserEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id={id} />
			<UserStockAddModal setIsOpen={setStockAddModalStatus} isOpen={stockAddModalStatus} id={id} />
			<UserStockOutModal setIsOpen={setStockOutModalStatus} isOpen={stockOutModalStatus} id={id} />
			
		</PageWrapper>
	);
};
export default Index;
