import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');
  const history = useHistory();

  const searchHandler = e => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/search/${keyword}`);
    } else {
      history.push('/');
    }
  };
  return (
    <Form onSubmit={searchHandler} inline>
      <Form.Group controlId='search'>
        <Form.Control
          type='text'
          name='search'
          value={keyword}
          placeholder='Search here...'
          onChange={e => setKeyword(e.target.value)}
        ></Form.Control>
      </Form.Group>
      <Button variant='outline-success' className='p-2' type='submit'>
        search
      </Button>
    </Form>
  );
};

export default SearchBox;
