from flask import Blueprint, request, jsonify

widgets_blueprint = Blueprint('widgets', __name__)

@widgets_blueprint.route("/widgets", methods=["POST"])
def get_widgets():
    data = request.get_json()
    stock_name = data.get("stock_name", "").upper()

    if not stock_name:
        return jsonify({"error": "Stock name is required"}), 400

    widgets = {
        "technical": f"""
        <blockquote class="trendlyne-widgets" data-get-url="https://trendlyne.com/web-widget/technical-widget/Poppins/{stock_name}/?posCol=00A25B&primaryCol=006AFF&negCol=EB3B00&neuCol=F7941E" data-theme="light"></blockquote>
        """,
        "checklist": f"""
        <blockquote class="trendlyne-widgets" data-get-url="https://trendlyne.com/web-widget/checklist-widget/Poppins/{stock_name}/?posCol=00A25B&primaryCol=006AFF&negCol=EB3B00&neuCol=F7941E" data-theme="light"></blockquote>
        """,
        "qvt": f"""
        <blockquote class="trendlyne-widgets" data-get-url="https://trendlyne.com/web-widget/qvt-widget/Poppins/{stock_name}/?posCol=00A25B&primaryCol=006AFF&negCol=EB3B00&neuCol=F7941E" data-theme="light"></blockquote>
        """,
        "swot": f"""
        <blockquote class="trendlyne-widgets" data-get-url="https://trendlyne.com/web-widget/swot-widget/Poppins/{stock_name}/?posCol=00A25B&primaryCol=006AFF&negCol=EB3B00&neuCol=F7941E" data-theme="light"></blockquote>
        """
    }

    return jsonify({"widgets": widgets})
