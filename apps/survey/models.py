from tortoise import Model, fields

class survey(Model):
    class Meta:
        table = 'survey'
        
    id = fields.IntField(pk=True)
    success = fields.BooleanField(null=False)
    amount_mistakes = fields.IntField(null=False, default=0)
    rewrite_session_id = fields.ForeignKeyFields('models.Task', null=False)
    