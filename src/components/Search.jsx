const Search = (props) => {
    const { searchTerm, setSearchTerm } = props;
    return (
        <div className="search">
            <div>
                <img src="./search.svg" alt="Search" />
                <input type="text"
                    placeholder="Search Movies"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    )
}

export default Search;