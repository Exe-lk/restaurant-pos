// import React, { useState } from 'react';
// import type { NextPage, GetStaticProps } from 'next';
// import Head from 'next/head';
// import { useRouter } from 'next/router';
// import dayjs from 'dayjs';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// import useDarkMode from '../../../hooks/useDarkMode';
// import { doc, getDoc } from 'firebase/firestore';
// import PaginationButtons, {
//   dataPagination,
//   PER_COUNT,
// } from '../../../components/PaginationButtons';
// import useSortableData from '../../../hooks/useSortableData';
// import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
// import { demoPagesMenu } from '../../../menu';
// import SubHeader, {
//   SubHeaderLeft,
//   SubHeaderRight,
//   SubheaderSeparator,
// } from '../../../layout/SubHeader/SubHeader';
// import Button from '../../../components/bootstrap/Button';
// import Page from '../../../layout/Page/Page';
// import Card, {
//   CardActions,
//   CardBody,
//   CardHeader,
//   CardLabel,
//   CardTitle,
// } from '../../../components/bootstrap/Card';
// import Avatar from '../../../components/Avatar';
// import { getColorNameWithIndex } from '../../../common/data/enumColors';
// import Icon from '../../../components/icon/Icon';
// import { priceFormat } from '../../../helpers/helpers';
// import CustomerEditModal from '../_common/CustomerEditModal';
// import Swal from 'sweetalert2';

// interface EmployeeData {
//   id: string;
//   name: string;
//   designation: string;
//   // ... Other properties
//   membershipDate: Date; // Assuming membershipDate is a Date object
// }

// const Id: NextPage<{ employeeData: EmployeeData }> = ({ employeeData }) => {
//   const router = useRouter();
//   const { id } = router.query;

//   const { darkModeStatus } = useDarkMode();

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [perPage, setPerPage] = useState<number>(PER_COUNT['3']);

//   // Sorting functionality for sales data
//   const { items, requestSort, getClassNamesFor } = useSortableData([]);

//   // State for the edit modal
//   const [editModalStatus, setEditModalStatus] = useState<boolean>(false);

//   // Open the edit modal
//   const handleClickEdit = () => {
//     setEditModalStatus(true);
//   };

//   // Delete functionality
//   const handleDelete = () => {
//     // Perform the actual delete logic here
//     // ...
//   };

//   const handleClickDelete = () => {
//     // Show SweetAlert for confirmation
//     // ...
//   };

//   return (
//     <PageWrapper>
//       <Head>
//         <title>{demoPagesMenu.hrm.subMenu.customer.text}</title>
//       </Head>
//       <SubHeader>
//         <SubHeaderLeft>
//           {/* Back to list button */}
//           <Button
//             color='primary'
//             isLink
//             icon='ArrowBack'
//             tag='a'
//             to={`../../${demoPagesMenu.hrm.subMenu.customersList.path}`}>
//             Back to List
//           </Button>
//           <SubheaderSeparator />
//         </SubHeaderLeft>
//         <SubHeaderRight>
//           {/* Edit and Delete buttons */}
//           <Button icon='Edit' color='primary' isLight onClick={handleClickEdit}>
//             Edit
//           </Button>
//           <Button icon='Delete' color='primary' isLight onClick={handleClickDelete}>
//             Delete
//           </Button>
//         </SubHeaderRight>
//       </SubHeader>
//       <Page>
//         <div className='pt-3 pb-5 d-flex align-items-center'>
//           <span className='display-4 fw-bold me-3'>{employeeData?.name}</span>
//           <span className='border border-success border-2 text-success fw-bold px-3 py-2 rounded'>
//             {employeeData?.designation}
//           </span>
//         </div>
//         <div className='row'>
//           {/* Remaining code remains the same */}
//         </div>
//       </Page>
//       {/* Edit modal */}
//       <CustomerEditModal
//         setIsOpen={setEditModalStatus}
//         isOpen={editModalStatus}
//         id={String(id) || 'loading'}
//       />
//     </PageWrapper>
//   );
// };

// export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
//   const id = params?.id as string;
//   const employeeDocRef = doc(firestore, 'employees', id);
//   const employeeDoc = await getDoc(employeeDocRef);
//   const employeeData = employeeDoc.data() as EmployeeData;

//   // Convert membershipDate to a JSON serializable format
//   const serializedEmployeeData = {
//     ...employeeData,
//     membershipDate: employeeData.membershipDate.toISOString(),
//   };

//   return {
//     props: {
//       employeeData: serializedEmployeeData,
//       // @ts-ignore
//       ...(await serverSideTranslations(locale, ['common', 'menu'])),
//     },
//   };
// };

// export async function getStaticPaths() {
//   return {
//     paths: [
//       // String variant:
//       '/hrm/customer/1',
//       // Object variant:
//       { params: { id: '2' } },
//     ],
//     fallback: true,
//   };
// }

// export default Id;




import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import Head from 'next/head';

import { useRouter } from 'next/router';
import dayjs, { Dayjs } from 'dayjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useDarkMode from '../../../hooks/useDarkMode';
import data from '../../../common/data/dummyCustomerData';
import latestSalesData from '../../../common/data/dummySalesData';
import PaginationButtons, {
	dataPagination,
	PER_COUNT,
} from '../../../components/PaginationButtons';
import useSortableData from '../../../hooks/useSortableData';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPagesMenu } from '../../../menu';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Button from '../../../components/bootstrap/Button';
import Page from '../../../layout/Page/Page';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Avatar from '../../../components/Avatar';
import { getColorNameWithIndex } from '../../../common/data/enumColors';
import Icon from '../../../components/icon/Icon';
import { priceFormat } from '../../../helpers/helpers';
import CustomerEditModal from '../../../components/custom/UserEditModal';
import Swal from 'sweetalert2';
import { getFirestore, collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import moment from 'moment';
import { number } from 'prop-types';

interface Employee {
	id: string;
	name: string;
	email: string;
	type: string;
	src: string
	designation: string;
	balance: number;
	streetAddress: string;
	city: string;
	state: string;
	stateFull: string;
	zip: string;
	NIC: string;
	birthday: Dayjs;
	accountNumber: string;
	bankName: string;
	membershipDate: moment.Moment;
	document: string;
	imageurl: string;
	cid: string;
	documentname:string;
	salary:string;
	points:string;
}


const Id: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;
	
	const { darkModeStatus } = useDarkMode();

	// Filter the customer data based on the 'id' parameter
	const itemData = data.filter((item) => item.id.toString() === id?.toString());
	const item = itemData[0];

	// Pagination state
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [perPage, setPerPage] = useState<number>(PER_COUNT['5']);

	// Sorting functionality for sales data
	const { items, requestSort, getClassNamesFor } = useSortableData(latestSalesData);

	// State for the edit modal
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false);

	// Open the edit modal
	const handleClickEdit = () => {
		setEditModalStatus(true);
	};
	//featch data
	const [employeeData, setEmployeeData] = useState<Employee[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const dataCollection = collection(firestore, 'employees');
				const q = query(dataCollection, where('NIC', '==', id));
				const querySnapshot = await getDocs(q);
				const firebaseData = querySnapshot.docs.map((doc) => {
					const data = doc.data() as Employee;
					return {

						...data,

						membershipDate: moment(data.membershipDate),
						cid: doc.id,

					};
				});
				console.log("dd" + id)
				setEmployeeData(firebaseData);
				console.log(employeeData[0])
				console.log('Firebase Data:', firebaseData);
			} catch (error) {
				console.error('Error fetching data: ', error);
			}
		};

		fetchData();
	}, [editModalStatus]);

	// Delete functionality
	const handleClickDelete = async (id: any) => {
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
				const docRef = doc(firestore, 'employees', employeeData[0]?.cid);
				await deleteDoc(docRef);

				// Show success message
				Swal.fire('Deleted!', 'Employee has been deleted.', 'success');
				router.push('/employeepages/manageemployees');
				
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			// Handle error (e.g., show an error message)
			Swal.fire('Error', 'Failed to delete employee.', 'error');
		}
	};


	return (
		<PageWrapper>
			<Head>
				<title>Employee</title>
			</Head>
			<SubHeader>
				<SubHeaderLeft>
					{/* Back to list button */}
					<Button
						color='primary'
						isLink
						icon='ArrowBack'
						tag='a'
						to={`../crm/coustomer`}>
						Back to List
					</Button>
					<SubheaderSeparator />
				</SubHeaderLeft>
				<SubHeaderRight>
					{/* Edit and Delete buttons */}
					<Button icon='Edit' color='primary' isLight onClick={handleClickEdit}>
						Edit
					</Button>
					<Button icon='Delete' color='primary' isLight onClick={() => handleClickDelete(id)}>
						Delete
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='pt-3 pb-5 d-flex align-items-center'>
					<span className='display-4 fw-bold me-3'>{employeeData[0]?.name}</span>
					<span className='border border-success border-2 text-success fw-bold px-3 py-2 rounded'>
						{employeeData[0]?.designation}
					</span>
				</div>
				<div className='row'>
					<div className='col-lg-4'>
						{/* Avatar and basic info card */}
						<Card className='shadow-3d-primary'>
							<CardBody>
								<div className='row g-5 py-3'>
									<div className='col-12 d-flex justify-content-center'>
										<Avatar
											src={employeeData[0]?.imageurl}
											color={getColorNameWithIndex(Number(employeeData[0]?.id))}
											isOnline={item?.isOnline}
										/>
									</div>
									<div className='col-12'>
										<div className='row g-3'>
											<div className='col-12'>
												<div className='d-flex align-items-center'>
													<div className='flex-shrink-0'>
														<Icon
															icon='Mail'
															size='3x'
															color='primary'
														/>
													</div>
													{/* Email information */}
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-5 mb-0'>
															{employeeData[0]?.email}
														</div>
														<div className='text-muted'>
															Email Address
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
						{/* Ratings and Membership duration card */}
						<Card>
							<CardHeader>
								<CardLabel icon='StackedLineChart'>
									<CardTitle>Statics</CardTitle>
								</CardLabel>
								<CardActions>
									Only in <strong>{dayjs().format('MMM')}</strong>.
								</CardActions>
							</CardHeader>
							<CardBody>
								<div className='row g-4 align-items-center'>
									<div className='col-xl-6'>
										{/* Rating */}
										<div
											className={`d-flex align-items-center bg-l${darkModeStatus ? 'o25' : '10'
												}-primary rounded-2 p-3`}>
											<div className='flex-shrink-0'>
												<Icon icon='Star' size='3x' color='primary' />
											</div>
											<div className='flex-grow-1 ms-3'>
											<div className='fw-bold fs-5 mb-1'> {employeeData[0]?.points}</div>
												<div className='text-muted mt-n2 truncate-line-1'>
													Rating
												</div>
											</div>
										</div>
									</div>
									<div className='col-xl-6'>
										{/* Membership duration */}
										<div
											className={`d-flex align-items-center bg-l${darkModeStatus ? 'o25' : '10'
												}-success rounded-2 p-3`}>
											<div className='flex-shrink-0'>
												<Icon icon='Timer' size='3x' color='success' />
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-5 mb-1'>{employeeData[0]?.membershipDate.fromNow()}</div>
												<div className='text-muted mt-n2'>Membership</div>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
					<div className='col-lg-8'>
						{/* Address, Birthday, NIC, Bank Details, and Type card */}
						<Card>
							<CardHeader>
								<CardLabel icon='MapsHomeWork'>
									<CardTitle>Address and Birthday</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row'>
									<div className='col-md-2'>
										{/* Address */}
										<p className='lead fw-bold'>Address</p>
										<div>{employeeData[0]?.streetAddress},</div>
										<div>{employeeData[0]?.city}</div>
										<div></div>
										<div>{`${employeeData[0]?.state}, ${employeeData[0]?.stateFull}`}</div>
										<div>{employeeData[0]?.zip}</div>
										<br />
										<div className='row g-2'>
											<div className='col-auto'>
											</div>
										</div>
									</div>
									<div className='col-md-2'>
										{/* Birthday */}
										<p className='lead fw-bold'>Birthday</p>
										<div>{dayjs(employeeData[0]?.birthday).format('YYYY-MM-DD')}</div>
										<br />
										<div className='row g-2'>
											<div className='col-auto'>
											</div>
											<div className='col-auto'>
											</div>
										</div>
									</div>
									<div className='col-md-2'>
										{/* NIC */}
										<p className='lead fw-bold'>NIC</p>
										<div> {employeeData[0]?.NIC}</div>
										<br />
										<div className='row g-2'>
											<div className='col-auto'>
											</div>
										</div>
									</div>
									<div className='col-md-2'>
										{/* Bank Details */}
										<p className='lead fw-bold'>Bank Details</p>
										<div>{employeeData[0]?.accountNumber}</div>
										<div>{employeeData[0]?.bankName}</div>
										<br />
										<div className='row g-2'>
											<div className='col-auto'>
											</div>
										</div>
									</div>
									<div className='col-md-2'>
										{/* NIC */}
										<p className='lead fw-bold'>Salary</p>
										<div> {employeeData[0]?.salary}</div>
										<br />
										<div className='row g-2'>
											<div className='col-auto'>
											</div>
										</div>
									</div>
									<div className='col-md-2'>
										<p className='lead fw-bold'>Type</p>
										<div>{employeeData[0]?.type}</div>
										<br />
										<div className='row g-2'>
											<div className='col-auto'>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
						{/* Personal Documents card */}
						<Card>
							<CardHeader>
								<CardLabel icon='Receipt'>
									<CardTitle>Personal Documents</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								{/* Document table */}
								<table className='table table-modern table-hover'>
									<thead>
										<tr>
											<th
												onClick={() => requestSort('name')}
												className='cursor-pointer text-decoration-underline'>
												Document Name{' '}
												<Icon
													size='lg'
													className={getClassNamesFor('name')}
													icon='FilterList'
												/>
											</th>
											<th
												onClick={() => requestSort('date')}
												className='cursor-pointer text-decoration-underline'>
												{' '}
												<Icon
													size='lg'
													className={getClassNamesFor('date')}
													icon='FilterList'
												/>
											</th>
										</tr>
									</thead>
									<tbody>

										<tr>
											<td>{employeeData[0]?.documentname}</td>
											{/* View button */}
											<td>
												<Button
													icon='Visibility'
													tag='a'
													to={employeeData[0]?.document}>
													View
												</Button>
											</td>
										</tr>

									</tbody>
								</table>
								{/* Pagination for documents */}
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
			{/* Edit modal */}
			<CustomerEditModal
				setIsOpen={setEditModalStatus}
				isOpen={editModalStatus}
				id={employeeData[0]?.cid}

			/>
		</PageWrapper>
	);
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		// @ts-ignore
		...(await serverSideTranslations(locale, ['common', 'menu'])),
	},
});

export async function getStaticPaths() {
	return {
		paths: [
			// String variant:
			'/admin/crm/1',
			// Object variant:
			{ params: { id: '2' } },
		],
		fallback: true,
	};
}

export default Id;
