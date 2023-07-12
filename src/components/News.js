import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import NewCard from './NewCard';
import Loading from './Loading';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';


export class News extends PureComponent {

    static defaultProps = {
        category: "top-headlines",
        Country: "us"
    }

    static propTypes = {
        category: PropTypes.string,
        Country: PropTypes.string,
        routerMapping: PropTypes.array.isRequired,
    }

    constructor() {
        super();
        this.state = {
            article: [],
            pagNo: 1,
            totalNumber: 0,
            perPageNum: 6,
            // isLoading: false,
            isMore: false
        }
    }
    componentDidMount() {
        this.props.setLoadingProgressBar(20);
        console.log("From ComponentDidMount")
        this.fetchData();
        this.props.setLoadingProgressBar(100);
      }
      
    async componentDidUpdate(prevProps) {
        if (prevProps.category !== this.props.category && this.state.article.length === 0) {
            this.setState({ article: [], pagNo: 0 }, async () => {
                this.props.setLoadingProgressBar(20);
                console.log("From ComponentDidUpdate")
            await this.fetchData();
            this.setState((prevState) => ({
              pagNo: prevState.pagNo + 1,
            }));
            this.props.setLoadingProgressBar(100);
          });
        }
      }
      

    fetchData = async () => {
        console.log("Page No :"+ this.state.pagNo );
        this.setState({
            pagNo: this.state.pagNo + 1,
        });
        this.props.setLoadingProgressBar(50);
        await this.appendNextArticles();
        this.props.setLoadingProgressBar(100);
    };
    
    
    


    // async updatePage() {
    //     this.setState({
    //         isLoading: true
    //     });

    //     let rawData = await fetch(`https://newsapi.org/v2/top-headlines?country=${this.props.Country}&category=${this.props.category}&apiKey=b0f1b707674e4cce976e5f36113713ea` + `&page=` + this.state.pagNo + `&pagesize=` + this.state.perPageNum);

    //     let parsedData = await rawData.json();
    //     this.setState({
    //         article: parsedData.articles,
    //         isLoading: false
    //     });
    // }

    // moveNextPage = () => {
    //     this.setState({
    //         pagNo: this.state.pagNo + 1,
    //     });
    //     this.updatePage();
    // }

    // movePrevPage = async () => {
    //     this.setState({
    //         pagNo: this.state.pagNo - 1,
    //     })
    //     this.updatePage();
    // }


    appendNextArticles = async () => {
        this.setState({
            // isLoading: true
        });
    
        let rawData = await fetch(
            `https://newsapi.org/v2/top-headlines?country=${this.props.Country}&category=${this.props.category}&apiKey=b0f1b707674e4cce976e5f36113713ea` +
                `&page=` +
                this.state.pagNo +
                `&pagesize=` +
                this.state.perPageNum
        );
        this.props.setLoadingProgressBar(60);
        let parsedData = await rawData.json();
        this.props.setLoadingProgressBar(80);
        this.setState((prevState) => ({
            article: [...prevState.article, ...parsedData.articles],
            // isLoading: false,
            isMore: prevState.article.length + parsedData.articles.length < parsedData.totalResults,
        }));
        
        this.props.setLoadingProgressBar(100);
    };




    getNextCategoryObj = () => {
        let currentIndex = this.props.routerMapping.findIndex(
            (route) => route.category === this.props.category
        )
        currentIndex = (currentIndex + 1) % this.props.routerMapping.length
        return this.props.routerMapping[currentIndex]
    }



    render() {
        return (
            <InfiniteScroll
                dataLength={this.state.article.length} //This is important field to render the next data
                next={this.fetchData}
                hasMore={true}
                loader={(this.state.isMore) && <Loading />}
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <b>Yay! You have seen it all</b>
                    </p>
                }
                topclassName={"Container"}
            >
                <Container key={this.state.pagNo + 1}>
                    <Row>
                        {
                            this.state.article && this.state.article.map((element) => {
                                return element.description && <Col key={element.url} className={"md-4 d-flex justify-content-center"}>
                                    <NewCard title={element.title} description={element.description} imgUrl={element.urlToImage} btnUrl={element.url} author={element.author} publishedAt={element.publishedAt} />
                                </Col>
                            })
                        }
                    </Row>
                </Container>

                {/* <Container className={"mb-5"}>
                                <Row>
                                    <Col md={4}>
                                        <Button className={"py-2 px-4"} variant="primary" disabled={this.state.pagNo > 1 ? false : true} onClick={this.movePrevPage}>&larr; Prev</Button>
                                    </Col>

                                    <Col md={{ span: 4, offset: 4 }}>
                                        <Button className={"py-2 px-4"} variant="primary" disabled={this.state.pagNo < Math.ceil(this.state.totalNumber / this.state.perPageNum) ? false : true} onClick={this.moveNextPage}>Next &rarr; </Button>
                                    </Col>
                                </Row>
                            </Container> */}

                {!this.state.isMore && <div className='d-flex justify-content-center my-4'>
                    <Link to={this.getNextCategoryObj().path}>
                        <button className="py-2 px-4" varient="primary">
                            Go to {this.getNextCategoryObj().category}
                        </button>
                    </Link>
                </div>}
                {/* {! this.state.isMore && <Loading/>} */}
            </InfiniteScroll>
        )
    }
}

export default News
