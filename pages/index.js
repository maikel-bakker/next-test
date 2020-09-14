import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Axios from 'axios'
import Prismic from 'prismic-javascript'
import humps from 'lodash-humps'

export default function Home({ data }) {
  console.log(data)
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Feature Test test
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}

export async function getStaticProps () {
  const client = Prismic.client(process.env.NEXT_PUBLIC_PRISMIC_API_URL)
  const response = await client.getByUID('page', 'home',
    {
      graphQuery: `
        {
          page {
            content_blocks {
              content_block {
                ... on page_header {
                  ...page_headerFields
                }
                ... on section {
                  ...sectionFields
                }
                ... on section_list {
                  ...section_listFields
                }
              }
            }
          }
        }
      `
    }
  )

  let contentBlocks = response.data.content_blocks && response.data.content_blocks.map(async ({ content_block }) => {
    if (content_block?.data?.form) {
      return {
        ...content_block,
        data: {
          ...content_block.data,
          form: {
            ...content_block.data.form,
            ... await client.getByID(content_block.data.form.id, {
              graphQuery: `
              {
                form {
                  submit_label
                  form_rows {
                    form_row {
                      ... on form_row {
                        ...form_rowFields
                      }
                    }
                  }
                }
              }
            `
            })
          }
        }
      }
    }

    return content_block

  })

  contentBlocks = await Promise.all(contentBlocks)

  const data = humps({
    ...response,
    data: {
      ...response.data,
      content_blocks: contentBlocks
    }
  })

  return {
    props: { data }
  }
}
