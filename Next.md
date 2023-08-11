## use immer

```typescript
const showModal = setPageState(c => c.showModal = true);
```

## use combine store

```typescript
const params = createCore<Params><(() => {})
const items = createCore<Item[]>(() => [])

export const [ useState, setState, getState ] = createStore<params:Params, items: item[]>(()=>({
  params,
  items,
}))

console.log(getState()) // { params: {}, items: [] }
function setQueryText(text:string){
  setState(c => {
    c.query.text = text
  } )
}
```

## use local/session storage

```typescript
type User {
  token,
  name,
}

function initialUser(): User {
  return {
    token: '',
    name: '',
  }
}

// use localStorage init / set
const [] = createStore<User>(initialUser, {
  local: c => {
    token = c.token
  }
})

// use localStorage only init
const [] = createStore<User>(initialUser, {
  local: {
    init: c => {
      token = c.token
    }
  }
})

// use sessionStorage init / set
const [] = createStore<User>(initialUser, {
  session: c => {
    token = c.token
  }
})

// use sessionStorage only init
const [] = createStore<User>(initialUser, {
  session: {
    init: c => {
      token = c.token
    }
  }
})

// init sequece local -> session

```

## use query

```typescript
const params = createCore<Params><(() => {})
const items = createCore<Item[]>(() => [])

export const [ useState, setState, getState ] = createStore<params:Params, items: item[]>(() => ({
  params,
  items,
}), {
  readOnly: (c) => ({ c.items }),
  query: async (c, dispatch) => {
    const { params } = c;
    const r = await fetch(url, { params });
    const items = await r.json();
    c.items = items as Item[];
  },
  revalidateTime: 1 //seconds
  revalidate: ({ params }) => ({ params })
})

// when use in react componet

const {items, params, _isFetched, _isFetching, _error} = useState();

```

#### why use store?

