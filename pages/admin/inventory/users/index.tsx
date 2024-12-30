import React, { useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';
import useDarkMode from '../../../../hooks/useDarkMode';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../../layout/SubHeader/SubHeader';
import Icon from '../../../../components/icon/Icon';
import Input from '../../../../components/bootstrap/forms/Input';
import Button from '../../../../components/bootstrap/Button';
import Page from '../../../../layout/Page/Page';
import Card, { CardBody, CardTitle } from '../../../../components/bootstrap/Card';
import UserAddModal from '../../../../components/custom/CostomerAddModal';
import UserEditModal from '../../../../components/custom/CoustomerEditModal';
import Dropdown, { DropdownToggle, DropdownMenu } from '../../../../components/bootstrap/Dropdown';
import Swal from 'sweetalert2';

import { toPng, toSvg } from 'html-to-image';
import { DropdownItem } from '../../../../components/bootstrap/Dropdown';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import PaginationButtons, {
	dataPagination,
	PER_COUNT,
} from '../../../../components/PaginationButtons';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { firestore } from '../../../../firebaseConfig';

const Index: NextPage = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [addModalStatus, setAddModalStatus] = useState<boolean>(false);
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false);
	const [deleteModalStatus, setDeleteModalStatus] = useState<boolean>(false);
	const [id, setId] = useState<string>('');
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [dealers, setDealers] = useState<any[]>([]);
	const [perPage, setPerPage] = useState<number>(PER_COUNT['50']);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const dataCollection = collection(firestore, 'costomer');
				const querySnapshot = await getDocs(dataCollection);
				const firebaseData = querySnapshot.docs.map((doc) => {
					const data = doc.data();
					return {
						...data,
						id: doc.id,
					};
				});
				setDealers(firebaseData);
			} catch (error) {
				console.error('Error fetching data: ', error);
			}
		};

		fetchData();
	}, [addModalStatus, editModalStatus]);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, [dealers]);

	const handleClickDelete = async (id: string) => {
		console.log(id);
		try {
			const result = await Swal.fire({
				title: 'Are you sure?',
				text: 'You will not be able to recover this employee!',
				// text: id,
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, delete it!',
			});

			if (result.isConfirmed) {
				const docRef = doc(firestore, 'costomer', id);
				await deleteDoc(docRef);

				// Show success message
				Swal.fire('Deleted!', 'Employee has been deleted.', 'success');

				const dataCollection = collection(firestore, 'costomer');
				const querySnapshot = await getDocs(dataCollection);
				const firebaseData = querySnapshot.docs.map((doc) => {
					const data = doc.data();
					return {
						...data,
						id: doc.id,
					};
				});
				setDealers(firebaseData);
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			// Handle error (e.g., show an error message)
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
						ref={inputRef}
					/>
				</SubHeaderLeft>
				<SubHeaderRight>
					<Button
						icon='PersonAdd'
						color='success'
						isLight
						onClick={() => setAddModalStatus(true)}>
						New Dealer
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						<Card stretch>
							<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-primary'>
									Dealer Management
								</div>
							</CardTitle>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-bordered border-primary  table-hover'>
									<thead className={'table-dark border-primary'}>
										<tr>
											<th>Dealer</th>

											<th>E-mail</th>
											<th>Address</th>
											<th>Mobile number</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										{dealers &&
											dataPagination(dealers, currentPage, perPage)
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
														<td>{dealer.email}</td>
														<td>{dealer.address}</td>
														<td>{dealer.mobileNumber}</td>
														<td>
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
								{/* <Button
									icon='Delete'
									className='mb-5'
									onClick={() => setDeleteModalStatus(true)}>
									Recycle Bin
								</Button> */}
							</CardBody>
							<PaginationButtons
								data={dealers}
								label='parts'
								setCurrentPage={setCurrentPage}
								currentPage={currentPage}
								perPage={perPage}
								setPerPage={setPerPage}
							/>
						</Card>
					</div>
				</div>
			</Page>
			<UserAddModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id='' />
			<UserEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id={id} />
		</PageWrapper>
	);
};

export default Index;
