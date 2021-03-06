import fs from 'fs'
import matter from 'gray-matter'
import Markdown from 'markdown-to-jsx'
import Head from 'next/head'
import TextIcon from '../../../components/TextIcon'
import Link from 'next/link'
import { ArrowLeft } from 'react-bootstrap-icons'
import { Row, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import React from 'react'
import Highlight from 'react-highlight.js'

function Blueprint(props) {
  const copyToClipboard = async (e) => {
    await navigator.clipboard.writeText(
      `https://github.com/EPMatt/awesome-ha-blueprints/blob/main/blueprints/${props.category}/${props.id}/${props.id}.yaml`
    )
  }
  return (
    <>
      <Head>
        <title>{props.data.name} - Awesome HA Blueprints </title>
      </Head>
      <Row className='mb-3 justify-content-between'>
        <Col xs='auto'>
          <TextIcon
            as={Link}
            left
            href={`/blueprints/${props.category}`}
            icon={<ArrowLeft />}
            text={`Go back to the ${props.category} category`}
          />
        </Col>
        <Col xs='auto'>
          <OverlayTrigger
            trigger='click'
            placement='top'
            overlay={(props) => (
              <Tooltip id='overlay-example' {...props}>
                Link Copied!
              </Tooltip>
            )}
          >
            <Button onClick={copyToClipboard} variant='success'>
              Copy Link
            </Button>
          </OverlayTrigger>
        </Col>
      </Row>
      <Markdown
        options={{
          overrides: {
            code: {
              component: Highlight,
              props: {
                language: 'yaml',
              },
            },
          },
        }}
      >
        {props.content}
      </Markdown>
    </>
  )
}

async function getStaticProps({ params }) {
  const doc = fs
    .readFileSync(`blueprints/${params.category}/${params.id}/README.md`)
    .toString()
  const { data, content } = matter(doc)
  return {
    props: { data, content, category: params.category, id: params.id },
  }
}

async function getStaticPaths() {
  /* scan all blueprint categories */
  const categories = fs
    .readdirSync('blueprints', { withFileTypes: true })
    .filter((f) => f.isDirectory())
    .map((f) => f.name)
  const paths = []
  categories.forEach((c) => {
    const blueprints = fs.readdirSync(`blueprints/${c}`)
    blueprints.forEach((b) => paths.push({ params: { category: c, id: b } }))
  })
  return {
    paths,
    fallback: false,
  }
}

export { getStaticProps, getStaticPaths }
export default Blueprint
