---
title: 使用说明
date: 2017-03-23 09:07:36
categories:
- categories-test
tags:
- tags-test1
- tags-test2
---

# 使用说明
{% asset_img avatar.jpg This is an example image %}

{% blockquote %}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque hendrerit lacus ut purus iaculis feugiat. Sed nec tempor elit, quis aliquam neque. Curabitur sed diam eget dolor fermentum semper at eu lorem.
{% endblockquote %}

{% blockquote David Levithan, Wide Awake %}
Do not just seek happiness for yourself. Seek happiness for all. Through kindness. Through mercy.
{% endblockquote %}

{% blockquote @DevDocs https://twitter.com/devdocs/status/356095192085962752 %}
NEW: DevDocs now comes with syntax highlighting. http://devdocs.io
{% endblockquote %}

{% blockquote Seth Godin http://sethgodin.typepad.com/seths_blog/2009/07/welcome-to-island-marketing.html Welcome to Island Marketing %}
Every interaction is both precious and an opportunity to delight.
{% endblockquote %}


{% codeblock lang:javascript %}
if (this.email != '') {
    this.emailEdit = true;
    this.emailPlaceholder = this.email;
    this.email = '';
    this.emailRules = {
        email
    };
    this.canEditClass = 'can-edit-class';
} else {
    this.canEditClass = '';
    this.emailRules = {
        required: {
            rule: true,
            message: '请填写邮箱'
        },
        email
    };
}
{% endcodeblock %}



{% codeblock _.compact http://underscorejs.org/#compact Underscore.js %}
_.compact([0, 1, false, 2, '', 3]);
=> [1, 2, 3]
{% endcodeblock %}

{% pullquote [class] %}
content
{% endpullquote %}

{% jsfiddle shorttag [tabs] [skin] [width] [height] %}










