from tortoise import Model, fields

class Task(Model):
    class Meta:
        table = 'task'
        
    id = fields.IntField(pk=True)
    img = fields.TextField()
    result_text = fields.BinaryField(null=True)
    created_at = fields.DatetimeField(auto_now_add = True, null=False)

