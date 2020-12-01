// This is the template for each programmatically generated item in the shop. It will be populated by our Sanity Project.

import React from "react";
import { graphql } from "gatsby";
import Img from "gatsby-image";
import styled from "styled-components"

import Layout from "../components/layout";

const Product = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  align-items: center;
  width: max-content;
  margin: 0 auto;
  & > div{
    margin: 1rem;
    width: 400px;
    max-width: 80vw;
    margin: 1rem;
    @media screen and (min-width: 768px){
      margin: 1rem;
    }
  }
  & > div > label {
    margin-left:.5rem;
  }
  @media screen and (min-width: 768px){
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
`

const Heading = styled.h1`
  font-weight: 900;
  font-size: 1.5em;
  margin: 20px 0;
`

const ImgStyled = styled(Img)`
  width: 400px;
  height: 400px;
  max-width: 80vw;
  @media screen and (min-width: 768px){
    width: 100%;
  }
`

const Price = styled.p`
  margin-bottom: 10px;
  padding: 10px;
  font-weight: 700;
  font-size: 2rem;
`

const Description = styled.p`
  margin-bottom: 20px;
  padding: 10px;
`

const Dropdown = styled.select`
  position: relative;
  display: block;
  padding: 10px;
  margin: 10px 0;
  background: ${props => props.theme.colors.white};
  font-weight: 700;
  border: 3px solid ${props => props.theme.colors.black};
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: transparent;
  background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
  background-repeat: no-repeat;
  background-position-x: 100%;
  background-position-y: 5px;
  &:hover {
    cursor: pointer;
    transform: translateY(-2px);
  }
  &:hover > option {
    color: ${props => props.theme.colors.black};
  }
`

const InputWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > * {
    width: 150px;
    margin: .5rem;
  }
`

const DropdownOption = styled.option`
  padding: 20px;
  background: ${props => props.theme.colors.white};
  font-weight: 700;
  border: none;
  outline: none;
  
`

const BuyButton = styled.button`
  padding: 5px;
  border: 3px solid ${props => props.theme.colors.black};
  background: white;
  font-weight: 700;
  &:hover{
    transform: rotate(2deg);
  }
`


export default class SingleItem extends React.Component {
  state = {
    item: this.props.data.item,
    selected: this.props.data.item.variants[0],
  }

  setSelected = (value) => {
    const index = this.props.data.item.variants.map((e) => { return e.title; })
    this.setState({ selected: this.props.data.item.variants[index.indexOf(value)]})
  }

  // create the string required by snipcart to allow price changes based on option chosen
  createString = (values) => {
    return values.map(option => {
      const price = option.price >= 0 ? `[+${option.price - this.state.selected.price}]` : `[${option.price}]`
      return `${option.title}${price}`
    }).join('|')
  }

  // calculate price based on option selected for display on item page
  updatePrice = (basePrice, values) => {
    const selectedOption = values.find(option => option.title === this.state.selected)
    return (basePrice + selectedOption.priceChange).toFixed(2)
  }

    render(){
      let item = this.state.item
      let selected = this.state.selected
      const siteTitle = 'site title';

      if(item.variants.length === 1){
        return (
          <Layout location={siteTitle} >
            <Product>
              <div>
                <Heading>{item.title}</Heading>
                <ImgStyled fluid={item.variants[0].images[0].asset.fluid} />
              </div>
              <div>
                <Price>${selected.price}</Price>
                <Description>{item.body.en[0].children[0].text}</Description>
                <InputWrap>
                  <BuyButton
                    className='snipcart-add-item'
                    data-item-id={item.id}
                    data-item-price={this.state.selected.price}
                    data-item-name={item.title}
                    data-item-description={item.blurb.en}
                    data-item-image={item.variants[0].images[0].asset.fluid.src}
                    data-item-url={"https://gatsbysnipcartsanity.netlify.app/products/" + item.slug.current} //REPLACE WITH OWN URL
                  >
                    Add to cart
                  </BuyButton>
                </InputWrap>
              </div>
            </Product>
          </Layout>
        )
      } else {
        return (
          <Layout location={siteTitle} >
            <Product>
              <div>
                <Heading>{item.title}</Heading>
                  <ImgStyled fluid={item.variants[0].images[0].asset.fluid} />
              </div>
              <div>
                <Price>${selected.price}</Price>
                <Description>{item.body.en[0].children[0].text}</Description>
                <label>{item.variant_type}</label>
                <InputWrap>
                    <Dropdown
                      id={item.title}
                      onChange={(e) => this.setSelected(e.target.value)}
                      value={this.state.selected.title}>
                      {item.variants.map((option) => (<DropdownOption key={option.title}>{option.title}</DropdownOption>))}
                    </Dropdown>
                  <BuyButton
                    className='snipcart-add-item'
                    data-item-id={item.id}
                    data-item-price={this.state.selected.price}
                    data-item-name={item.title}
                    data-item-description={item.blurb.en}
                    data-item-image={item.variants[0].images[0].asset.fluid.src}
                    data-item-url={"https://gatsbysnipcartsanity.netlify.app/products/" + item.slug.current} //REPLACE WITH OWN URL
                    data-item-custom1-name={item.variant_type}
                    data-item-custom1-options={this.createString(item.variants)}
                    data-item-custom1-value={selected.title}
                  >
                    Add to cart
                  </BuyButton>
                </InputWrap>
              </div>
            </Product>
          </Layout>
          )
      }
    }
}

export const pageQuery = graphql`
  query ItemBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    item: sanityProduct(slug: { current: { eq: $slug } }) {
      id
      title
      slug {
        current
      }
      blurb {
        en
      }
      body {
        en {
          children {
            text
          }
        }
      }
      variants {
        _key
        _type
        title
        grams
        price
        sku
        taxable
        _rawImages
        _rawBarcode
        images {
        asset {
          assetId
          description
          fluid(maxWidth: 800) {
            src
          }
        }
      }
      }
      variant_type
    }
  }
`
