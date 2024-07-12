import React, {useState, useEffect} from "react";
import axios from "axios";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import MemberTable from "./MemberTable";
import Paging from "./Paging";



function SearchForm(){

    // 페이징 처리용 변수
    const [memberList, setMemberList] = useState([]);
    const [totalPage, setTotalPage] = useState(1);

    // 검색용 변수
    const [searchData, setSearchData] = useState({
        searchFilter: '',
        searchQuery: ''
    });

	// 컴포넌트가 처음 마운트될 때 회원 목록을 불러오는 useEffect 훅을 선언한다
	useEffect(() => {
		loadMembers();
	}, []);

    // 전체 정보 조회 
	const loadMembers = async () => {

        try {
            let response = await axios.get("/admin");
            setMemberList(response.data.memberList);
            setTotalPage(response.data.totalPage);

            console.log(response.data);
        } catch (error) {
            alert('회원이 없습니다');
            console.log(error.message);
        } 
		
	}

    // form 입력값 변경 핸들러 
    const handleChange = (e) => {
        const {name, value} = e.target;
        setSearchData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    // form submit 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const response = await axios.get(`/admin?page=1&size=5&searchFilter=${searchData.searchFilter}&searchQuery=${searchData.searchQuery}`);
            setMemberList(response.data.memberList);
            setTotalPage(response.data.totalPage);

        } catch (error){
            console.log('search error: ', error);
        }
        
    }


    return (

        <div>
            <Form onSubmit={handleSubmit}>
                
                <InputGroup>

                    <Form.Select aria-label="Default select example" onChange={handleChange} name="searchFilter">
                        <option>검색옵션</option>
                        <option value="member_id">아이디</option>
                        <option value="member_name">이름</option>
                        <option value="member_phone">전화번호</option>
                        <option value="member_email">이메일</option>
                        <option value="member_birth">생일</option>
                        <option value="member_status">상태</option>
                        <option value="member_rate">평점</option>
                    </Form.Select>


                    <Form.Control
                    placeholder="검색어를 입력하세요"
                    aria-label="searchInput"
                    aria-describedby="basic-addon2"
                    name="searchQuery"  
                    value={searchData.searchQuery}
                    onChange={handleChange}
                    />
                    <Button variant="outline-secondary" id="button-addon2" type="submit"> 검색 </Button>
                </InputGroup>

            </Form>

            <MemberTable memberList={memberList}/>

            <Paging totalPage={totalPage} searchFilter={searchData.searchFilter} searchQuery={searchData.searchQuery} setMemberList={setMemberList}/>

        </div>



    );

}

export default SearchForm;