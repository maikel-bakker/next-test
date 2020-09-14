import Prismic from 'prismic-javascript'

export default Prismic.client(process.env.NEXT_PUBLIC_PRISMIC_API_URL)
