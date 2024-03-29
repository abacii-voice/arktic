
def truncate(f, n):
	'''Truncates/pads a float f to n decimal places without rounding'''
	s = '{}'.format(f)
	if 'e' in s or 'E' in s:
		return '{0:.{1}f}'.format(f, n)
	i, p, d = s.partition('.')
	return float('.'.join([i, (d+'0'*n)[:n]]))

def filterOrAllOnBlank(manager, **kwargs):
	if 'id' in kwargs and not kwargs['id']:
		del kwargs['id']

	return manager.filter(**kwargs)
