import { Link } from "react-router-dom";
import TextEditorSaveGit from "../../components/text-editor-save-git";
import textJsonRu from '../../locale/texts-site-ru.json';

const PrivacyPolicyEditor = () => {
    return (<>
    <div className="bg-gray-100 mt-12">
    <h1 className="p-10 text-4xl font-bold text-gray-800">{textJsonRu.privacy_policy.title}</h1>
    <TextEditorSaveGit path="public/fragmentPrivacyPolicy.html" />
    </div>
    <Link
          to="/"
          className="fixed top-4 right-20 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          На главную
        </Link>
    </>);
}


export default PrivacyPolicyEditor;