// SEA / standalone-binary entry: materialize embedded assets before the CLI
// reads package.json, .env, or proto files from the module root.
import './sea_assets'
import './index'
